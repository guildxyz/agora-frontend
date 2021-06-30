import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import useTokenAllowance from "hooks/useTokenAllowance"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent, Sender } from "xstate"
import useUnstake from "./useUnstake"

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
  error: Error | null
  showApproveSuccess: boolean
}

const allowanceMachine = {
  id: "allowance",
  initial: "initial",
  on: {
    PERMISSION_GRANTED: "unstake",
  },
  states: {
    initial: {
      invoke: {
        src: "checkAllowance",
        onError: "error",
      },
      on: {
        PERMISSION_NOT_GRANTED: "idle",
        PERMISSION_IS_PENDING: "loading.transaction",
        PERMISSION_IS_GRANTED: "#root.unstake",
      },
    },
    idle: {
      tags: "idle",
      on: {
        ALLOW: "loading",
      },
    },
    loading: {
      initial: "permission",
      states: {
        permission: {
          tags: "loading",
          meta: {
            loadingText: "Waiting confirmation",
          },
          invoke: {
            src: "confirmPermission",
            onDone: "transaction",
            onError: "#allowance.error",
          },
        },
        transaction: {
          tags: "loading",
          meta: {
            loadingText: "Waiting for transaction to succeed",
          },
          invoke: {
            src: "confirmTransaction",
            onDone: {
              target: "#root.unstake",
              actions: "showApproveSuccess",
            },
            onError: "#allowance.error",
          },
        },
      },
    },
    error: {
      tags: "idle",
      on: {
        ALLOW: "loading",
      },
      entry: "setError",
      exit: "removeError",
    },
  },
}

const unstakeMachine = {
  initial: "idle",
  states: {
    idle: {
      tags: "idle",
      on: {
        UNSTAKE: "loading",
        HIDE_APPROVE_SUCCESS: {
          target: "idle",
          actions: "hideApproveSuccess",
        },
      },
      exit: "hideApproveSuccess",
    },
    loading: {
      tags: "loading",
      meta: {
        loadingText: "Waiting confirmation",
      },
      invoke: {
        src: "unstake",
        onDone: "success",
        onError: "error",
      },
    },
    error: {
      tags: "idle",
      on: {
        UNSTAKE: "loading",
      },
      entry: "setError",
      exit: "removeError",
    },
    success: {
      tags: "success",
    },
  },
}

const unstakingModalMachine = createMachine<
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
      unstake: unstakeMachine,
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
      removeError: assign<ContextType, DoneInvokeEvent<any>>({ error: null }),
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

const useUnstakingModalMachine = (): any => {
  const unstake = useUnstake()
  const {
    chainData: {
      stakeToken: { address, name },
    },
  } = useCommunity()
  const [tokenAllowance, approve] = useTokenAllowance(address, name)

  const [state, send] = useMachine(unstakingModalMachine, {
    services: {
      checkAllowance: () => (_send: Sender<AllowanceCheckEvent>) => {
        if (!tokenAllowance) _send("PERMISSION_NOT_GRANTED")
        else _send("PERMISSION_IS_GRANTED")
      },
      confirmPermission: approve,
      confirmTransaction: async (_, event: DoneInvokeEvent<any>) =>
        event.data.wait(),
      unstake,
    },
  })

  useEffect(() => {
    send("RESET")
  }, [tokenAllowance, send])

  return [state, send]
}

export default useUnstakingModalMachine
