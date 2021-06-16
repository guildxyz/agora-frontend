import useStateMachine from "@cassiozen/usestatemachine"
import type { SignErrorType } from "../hooks/usePersonalSign"

type MachineContextType = {
  error: SignErrorType | null
}

const machineInitialContext = {
  error: null,
}

const machineConfig: any = {
  initial: "initial",
  // verbose: true,
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
      effect({ setContext, event: { error } }) {
        setContext(() => ({
          error,
        }))
        return () => setContext(() => machineInitialContext)
      },
    },
  },
}

const useLeaveModalMachine = (): [any, any] =>
  useStateMachine<MachineContextType>(machineInitialContext)(machineConfig)

export default useLeaveModalMachine
