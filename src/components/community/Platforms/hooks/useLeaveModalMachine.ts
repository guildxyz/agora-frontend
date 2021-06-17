import { useMachine } from "@xstate/react/lib/fsm"
import { createMachine, assign } from "@xstate/fsm"
import type { SignErrorType } from "./usePersonalSign"

type ContextType = {
  error: SignErrorType | null
}

type EventType = {
  type: string
  error: SignErrorType
}

const joinModalMachine = createMachine<ContextType, EventType>(
  {
    initial: "initial",
    states: {
      initial: {
        on: { leaveInProgress: "loading" },
      },
      loading: {
        on: {
          leaveFailed: "error",
          modalClosed: "initial",
        },
      },
      error: {
        on: { leaveInProgress: "loading", modalClosed: "initial" },
        entry: "setError",
        exit: "removeError",
      },
    },
    context: {
      error: null,
    },
  },
  {
    actions: {
      setError: assign<ContextType, EventType>({
        error: (_, event) => event.error,
      }),
      removeError: assign<ContextType, EventType>({
        error: () => null,
      }),
    },
  }
)

const useJoinModalMachine = (): any => useMachine(joinModalMachine)

export default useJoinModalMachine
