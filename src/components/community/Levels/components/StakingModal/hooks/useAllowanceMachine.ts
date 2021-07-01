import {
  createMachine,
  DoneInvokeEvent,
  EventData,
  Sender,
  State,
  assign,
} from "xstate"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
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
}

type ReturnType = [
  State<ContextType, DoneInvokeEvent<any> | AllowanceCheckEvent>,
  (
    event,
    payload?: EventData
  ) => State<ContextType, DoneInvokeEvent<any> | AllowanceCheckEvent>
]

const allowanceMachine = createMachine<
  ContextType,
  DoneInvokeEvent<any> | AllowanceCheckEvent
>(
  {
    id: "allowance",
    initial: "initial",
    context: {
      error: null,
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
          PERMISSION_IS_GRANTED: "success",
        },
      },
      idle: {
        on: {
          ALLOW: "loading",
        },
      },
      loading: {
        initial: "permission",
        states: {
          permission: {
            invoke: {
              src: "confirmPermission",
              onDone: "transaction",
              onError: "#allowance.error",
            },
          },
          transaction: {
            invoke: {
              src: "confirmTransaction",
              onDone: "#allowance.notification",
              onError: "#allowance.error",
            },
          },
        },
      },
      error: {
        on: {
          ALLOW: "loading",
        },
        entry: "setError",
        exit: "removeError",
      },
      notification: {
        initial: "showing",
        states: {
          showing: {
            on: {
              HIDE_NOTIFICATION: "hiding",
            },
          },
          hiding: {
            after: {
              500: "#allowance.success",
            },
          },
        },
      },
      success: {
        // type: "final",
      },
    },
    on: {
      SOFT_RESET: {
        target: "initial",
        cond: "notSucceeded",
      },
      HARD_RESET: {
        target: "initial",
      },
    },
  },
  {
    guards: {
      notSucceeded: (_context, _event, { state }) => !state.matches("success"),
    },
    actions: {
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useAllowanceMachine = (): ReturnType => {
  const [tokenAllowance, approve, mutate] = useTokenAllowance()
  const { account } = useWeb3React()
  const [state, send] = useMachine(allowanceMachine, {
    services: {
      checkAllowance: () => (_send: Sender<AllowanceCheckEvent>) => {
        if (!tokenAllowance) _send("PERMISSION_NOT_GRANTED")
        else _send("PERMISSION_IS_GRANTED")
      },
      confirmPermission: approve,
      confirmTransaction: async (_, event: DoneInvokeEvent<any>) =>
        event.data.wait(),
    },
  })

  useEffect(() => {
    send("SOFT_RESET")
  }, [tokenAllowance, send])

  useEffect(() => {
    send("HARD_RESET")
  }, [account, send])

  return [state, send]
}

export default useAllowanceMachine
