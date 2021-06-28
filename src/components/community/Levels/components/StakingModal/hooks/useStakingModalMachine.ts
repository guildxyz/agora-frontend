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
  error?: any
  showApproveSuccess?: boolean
}

const allowanceStates = {
  initial: {
    invoke: {
      src: "checkAllowance",
      onError: {
        target: "approveTransactionError",
        actions: "setError",
      },
    },
    on: {
      PERMISSION_NOT_GRANTED: {
        target: "noPermission",
      },
      PERMISSION_IS_PENDING: {
        target: "approveTransactionPending",
      },
      PERMISSION_IS_GRANTED: {
        target: "#main.stake",
      },
    },
  },
  noPermission: {
    tags: "idle",
    on: {
      ALLOW: "approving",
    },
  },
  approving: {
    tags: "loading",
    meta: {
      loadingText: "Waiting confirmation",
    },
    invoke: {
      src: "confirmPermission",
      onDone: {
        target: "approveTransactionPending",
      },
      onError: {
        target: "approveTransactionError",
        actions: "setError",
      },
    },
  },
  approveTransactionPending: {
    tags: "loading",
    meta: {
      loadingText: "Waiting for transaction to succeed",
    },
    invoke: {
      src: "confirmTransaction",
      onDone: {
        target: "#main.stake",
        actions: "showApproveSuccess",
      },
      onError: {
        target: "approveTransactionError",
        actions: "setError",
      },
    },
  },
  approveTransactionError: {
    tags: "idle",
    on: {
      ALLOW: "approving",
    },
    exit: "removeError",
  },
}

const stakeStates = {
  initial: {
    tags: "idle",
    on: {
      STAKE: "staking",
      HIDE_APPROVE_SUCCESS: {
        target: "initial",
        actions: "hideApproveSuccess",
      },
    },
  },
  staking: {
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
        target: "stakingError",
        actions: "setError",
      },
    },
  },
  stakingError: {
    tags: "idle",
    on: {
      STAKE: "staking",
    },
    exit: "removeError",
  },
  success: {
    tags: "done",
  },
}

const stakingModalMachine = createMachine<
  ContextType,
  DoneInvokeEvent<any> | AllowanceCheckEvent
>(
  {
    id: "main",
    initial: "allowance",
    context: {
      error: null,
    },
    states: {
      allowance: {
        initial: "initial",
        context: {
          showApproveSuccess: false,
        },
        on: {
          PERMISSION_GRANTED: "stake",
        },
        states: allowanceStates,
      },
      stake: {
        initial: "initial",
        states: stakeStates,
      },
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
        condMeta.state.value !== "success",
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
