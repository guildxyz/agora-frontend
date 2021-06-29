import { createMachine, assign, DoneInvokeEvent, Sender } from "xstate"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { parseEther } from "@ethersproject/units"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useTokenAllowance from "./useTokenAllowance"

type AllowanceCheckEvent =
  | {
      type: "PERMISSION_NOT_GRANTED"
    }
  | {
      type: "PERMISSION_IS_PENDING"
    }
  | {
      type: "PERMISSION_IS_GRANTED"
    }

type ContextType = {
  error: any
  showApproveSuccess: boolean
}

const allowanceMachine = {
  initial: "initial",
  on: {
    PERMISSION_GRANTED: "stake",
  },
  states: {
    initial: {
      invoke: {
        src: "checkAllowance",
        onError: {
          target: "error",
          actions: "setError",
        },
      },
      on: {
        PERMISSION_NOT_GRANTED: {
          target: "idle",
        },
        PERMISSION_IS_PENDING: {
          target: "transactionLoading",
        },
        PERMISSION_IS_GRANTED: {
          target: "#root.stake",
        },
      },
    },
    idle: {
      tags: "idle",
      on: {
        ALLOW: "permissionLoading",
      },
    },
    permissionLoading: {
      tags: "loading",
      meta: {
        loadingText: "Waiting confirmation",
      },
      invoke: {
        src: "confirmPermission",
        onDone: {
          target: "transactionLoading",
        },
        onError: {
          target: "error",
          actions: "setError",
        },
      },
    },
    transactionLoading: {
      tags: "loading",
      meta: {
        loadingText: "Waiting for transaction to succeed",
      },
      invoke: {
        src: "confirmTransaction",
        onDone: {
          target: "#root.stake",
          actions: "showApproveSuccess",
        },
        onError: {
          target: "error",
          actions: "setError",
        },
      },
    },
    error: {
      tags: "idle",
      on: {
        ALLOW: "permissionLoading",
      },
      exit: "removeError",
    },
  },
}

const stakeMachine = {
  initial: "idle",
  states: {
    idle: {
      tags: "idle",
      on: {
        STAKE: "loading",
        HIDE_APPROVE_SUCCESS: {
          target: "idle",
          actions: "hideApproveSuccess",
        },
      },
    },
    loading: {
      tags: "loading",
      meta: {
        loadingText: "Waiting confirmation",
      },
      invoke: {
        src: "stake",
        onDone: {
          target: "success",
        },
        onError: {
          target: "error",
          actions: "setError",
        },
      },
    },
    error: {
      tags: "idle",
      on: {
        STAKE: "loading",
      },
      exit: "removeError",
    },
    success: {
      tags: "success",
    },
  },
}

const stakingModalMachine = createMachine<
  ContextType,
  DoneInvokeEvent<any> | AllowanceCheckEvent
>(
  {
    id: "root",
    initial: "allowance",
    context: {
      error: null,
      showApproveSuccess: false,
    },
    states: {
      allowance: allowanceMachine,
      stake: stakeMachine,
    },
    on: {
      RESET: {
        target: "allowance",
        actions: "defaultContext",
        cond: "notSucceeded",
      },
    },
  },
  {
    guards: {
      notSucceeded: (_context, _event, condMeta) =>
        !condMeta.state.hasTag("success"),
    },
    actions: {
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
      showApproveSuccess: assign<ContextType, DoneInvokeEvent<any>>({
        showApproveSuccess: true,
      }),
      hideApproveSuccess: assign<ContextType, DoneInvokeEvent<any>>({
        showApproveSuccess: false,
      }),
      defaultContext: assign<ContextType, DoneInvokeEvent<any>>({
        error: null,
        showApproveSuccess: false,
      }),
    },
  }
)

const useStakingModalMachine = (amount: number): any => {
  const [tokenAllowance, approve] = useTokenAllowance()
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const [state, send] = useMachine(stakingModalMachine, {
    services: {
      checkAllowance: () => (_send: Sender<AllowanceCheckEvent>) => {
        if (!tokenAllowance) _send("PERMISSION_NOT_GRANTED")
        else _send("PERMISSION_IS_GRANTED")
      },
      confirmPermission: approve,
      confirmTransaction: async (_, event: DoneInvokeEvent<any>) =>
        event.data.wait(),

      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx = await contract.deposit(weiAmount)
        return tx
      },
    },
  })

  useEffect(() => {
    send("RESET")
  }, [tokenAllowance, send])

  return [state, send]
}

export default useStakingModalMachine
