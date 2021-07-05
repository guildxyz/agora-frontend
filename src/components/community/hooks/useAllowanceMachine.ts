import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { Token } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent, Sender } from "xstate"
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

const allowanceMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    id: "allowanceMachine",
    initial: "success",
    context: {
      error: null,
    },
    states: {
      idle: {
        on: {
          ALLOW: "waitingConfirmation",
          PERMISSION_IS_PENDING: "waitingForTransaction",
          PERMISSION_IS_GRANTED: "success",
        },
      },
      waitingConfirmation: {
        invoke: {
          src: "confirmPermission",
          onDone: "waitingForTransaction",
          onError: "error",
        },
        on: {
          PERMISSION_IS_PENDING: "waitingForTransaction",
          PERMISSION_IS_GRANTED: "successNotification",
        },
      },
      waitingForTransaction: {
        invoke: {
          src: "confirmTransaction",
          onDone: {
            target: "successNotification",
          },
          onError: "error",
        },
        on: {
          PERMISSION_IS_GRANTED: "successNotification",
        },
      },
      error: {
        on: {
          ALLOW: "waitingConfirmation",
          RESET: "idle",
          PERMISSION_IS_PENDING: "waitingForTransaction",
          PERMISSION_IS_GRANTED: "success",
        },
        entry: "setError",
        exit: "removeError",
      },
      successNotification: {
        on: {
          HIDE_NOTIFICATION: "success",
          RESET: "success",
          PERMISSION_NOT_GRANTED: "idle",
        },
      },
      success: {
        on: {
          PERMISSION_NOT_GRANTED: "idle",
          PERMISSION_IS_PENDING: "waitingForTransaction",
        },
      },
    },
  },
  {
    actions: {
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useAllowanceMachine = (token: Token): any => {
  const [tokenAllowance, approve] = useTokenAllowance(token)

  const [state, send] = useMachine<any, any>(allowanceMachine, {
    services: {
      checkAllowance: () => async (_send: Sender<AllowanceCheckEvent>) => {},
      confirmPermission: approve,
      confirmTransaction: async (_, event: DoneInvokeEvent<any>) =>
        event.data.wait(),
    },
  })

  useEffect(() => {
    if (tokenAllowance === undefined) return
    if (tokenAllowance) send("PERMISSION_IS_GRANTED")
    else send("PERMISSION_NOT_GRANTED")
  }, [tokenAllowance, send])

  // useEffect(() => console.log(state.value), [state])

  return [state, send]
}

export default useAllowanceMachine
