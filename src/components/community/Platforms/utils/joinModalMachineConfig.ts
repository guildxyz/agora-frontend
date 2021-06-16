import useStateMachine from "@cassiozen/usestatemachine"
import type { SignErrorType } from "../hooks/usePersonalSign"
import type { InviteData } from "../components/JoinModal"

type MachineContextType = {
  error: SignErrorType | null
  success: InviteData
}

const machineInitialContext = {
  error: null,
  success: { link: "", code: null },
}

const machineConfig: any = {
  initial: "initial",
  // verbose: true,
  states: {
    initial: {
      on: { signInProgress: "loading" },
    },
    loading: {
      on: {
        signSuccessful: "success",
        signFailed: "error",
        modalClosed: "initial",
      },
    },
    error: {
      on: { signInProgress: "loading", modalClosed: "initial" },
      effect({ setContext, event: { error } }) {
        setContext(() => ({
          ...machineInitialContext,
          error,
        }))
        return () => setContext(() => machineInitialContext)
      },
    },
    success: {
      effect({ setContext, event: { success } }) {
        setContext(() => ({
          ...machineInitialContext,
          success,
        }))
      },
    },
  },
}

const useJoinModalMachine = (): [any, any] =>
  useStateMachine<MachineContextType>(machineInitialContext)(machineConfig)

export default useJoinModalMachine
