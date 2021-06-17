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
}

const joinModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>({
  initial: "initial",
  context: {
    error: null,
    inviteData: initialInviteData,
  },
  states: {
    initial: {
      on: { SIGN: "signing" },
    },
    signing: {
      on: {
        CLOSE_MODAL: "initial",
      },
      invoke: {
        src: "sign",
        onDone: {
          target: "fetching",
        },
        onError: {
          target: "error",
        },
      },
    },
    fetching: {
      invoke: {
        src: "getInviteLink",
        onDone: {
          target: "success",
        },
        onError: {
          target: "error",
        },
      },
    },
    error: {
      on: { SIGN: "signing", CLOSE_MODAL: "initial" },
      entry: assign({
        error: (_, event) => event.data,
      }),
      exit: assign({
        error: () => null,
      }),
    },
    success: {
      entry: assign({
        inviteData: (_, event) => event.data,
      }),
      exit: assign({
        inviteData: () => initialInviteData,
      }),
    },
  },
})

const useJoinModalMachine = (platform: string): any => {
  const { id: communityId } = useCommunity()
  const sign = usePersonalSign()

  return useMachine(joinModalMachine, {
    actions: {},
    services: {
      sign: (_, e) => sign("Please sign this message to generate your invite link"),

      // ! This is a dummy function for the demo !
      getInviteLink: (_, e): Promise<InviteData> => {
        console.log(platform, communityId, e.data)
        return new Promise((resolve, reject) => {
          setTimeout(
            () =>
              resolve({
                link: "https://discord.gg/tfg3GYgu",
                code: 1235,
              }),
            3000
          )
        })
      },
    },
  })
}

export default useJoinModalMachine
