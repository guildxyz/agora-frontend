import { useMachine } from "@xstate/react/lib/fsm"
import { createMachine, assign } from "@xstate/fsm"
import type { InviteData } from "../components/JoinModal"
import type { SignErrorType } from "./usePersonalSign"

const initialInviteData = { link: "", code: null }

type ContextType = {
  error: SignErrorType | null
  inviteData: InviteData
}

type EventType = {
  type: string
  error?: SignErrorType
  inviteData?: InviteData
}

const joinModalMachine = createMachine<ContextType, EventType>(
  {
    id: "join_modal",
    initial: "initial",
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
        entry: "setError",
        exit: "removeError",
      },
      success: {
        entry: "setInviteData",
        exit: "revoveInviteData",
      },
    },
    context: {
      error: null,
      inviteData: initialInviteData,
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
      setInviteData: assign<ContextType, EventType>({
        inviteData: (_, event) => event.inviteData,
      }),
      revoveInviteData: assign<ContextType, EventType>({
        inviteData: () => initialInviteData,
      }),
    },
  }
)

const useJoinModalMachine = (): any => useMachine(joinModalMachine)

export default useJoinModalMachine
