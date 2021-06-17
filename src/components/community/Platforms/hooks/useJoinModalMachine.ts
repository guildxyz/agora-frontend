import { useMachine } from "@xstate/react"
import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { useCommunity } from "components/community/Context"
import { usePersonalSign } from "./usePersonalSign"
import type { InviteData } from "../components/JoinModal"
import type { SignErrorType } from "./usePersonalSign"

const initialInviteData: InviteData = { link: "", code: null }

type ContextType = {
  error: SignErrorType | null
  inviteData: InviteData
  sign: (message: string) => Promise<any>
  platform: string
  communityId: number
}

// ! This is a dummy function for the demo !
const getInviteLink = (
  platform: string,
  communityId: number,
  message: string
): InviteData => {
  // eslint-disable-next-line no-console
  console.log({ platform, communityId, message })
  return {
    link: "https://discord.gg/tfg3GYgu",
    code: 1235,
  }
}

const joinModalMachine = (initialContext: ContextType) =>
  createMachine<ContextType, DoneInvokeEvent<any>>(
    {
      id: "joinModal",
      initial: "initial",
      states: {
        initial: {
          on: { SIGN_IN_PROGRESS: "loading" },
        },
        loading: {
          on: {
            MODAL_CLOSED: "initial",
          },
          invoke: {
            id: "personalSign",
            src: (context) =>
              context.sign("Please sign this message to generate your invite link"),
            onDone: {
              target: "success",
            },
            onError: {
              target: "error",
            },
          },
        },
        error: {
          on: { SIGN_IN_PROGRESS: "loading", MODAL_CLOSED: "initial" },
          entry: "setError",
          exit: "removeError",
        },
        success: {
          entry: "setInviteData",
          exit: "removeInviteData",
        },
      },
      context: initialContext,
    },
    {
      actions: {
        setError: assign({
          error: (_, event) => event.data,
        }),
        removeError: assign({
          error: () => null,
        }),
        setInviteData: assign({
          inviteData: (context, event) =>
            getInviteLink(context.platform, context.communityId, event.data),
        }),
        removeInviteData: assign({
          inviteData: () => initialInviteData,
        }),
      },
    }
  )

const useJoinModalMachine = (platform: string): any => {
  const { id: communityId } = useCommunity()
  const sign = usePersonalSign()

  return useMachine(
    joinModalMachine({
      error: null,
      inviteData: initialInviteData,
      sign,
      platform,
      communityId,
    })
  )
}

export default useJoinModalMachine
