import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { useEffect, useRef } from "react"
import { DiscordError } from "temporaryData/types"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "./usePersonalSign"

type InviteData = {
  inviteLink: string
  joinCode?: number
}

const initialInviteData: InviteData = { inviteLink: "", joinCode: null }

type ContextType = {
  error: MetaMaskError | Response | Error | DiscordError | null
  inviteData: InviteData
  accessToken?: string
  tokenType?: string
  signedMessage: string
}

const joinModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
      inviteData: initialInviteData,
      accessToken: null,
      tokenType: null,
      signedMessage: null,
    },
    states: {
      idle: {
        on: {
          SIGN: "signing",
        },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: "authIdle",
          onError: "signError",
        },
      },
      signError: {
        on: { SIGN: "signing", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      authIdle: {
        entry: "saveSignedMessage",
        on: {
          AUTH: "authenticating",
        },
      },
      authenticating: {
        entry: "openDiscordAuthWindow",
        invoke: {
          src: "dcAuth",
          onDone: "success",
          onError: "authError",
        },
        on: {
          CLOSE_MODAL: "authIdle",
        },
      },
      authError: {
        on: { AUTH: "authenticating", CLOSE_MODAL: "authIdle" },
        entry: "setError",
        exit: "removeError",
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
    on: {
      RESET: {
        target: "idle",
      },
    },
  },
  {
    actions: {
      setError: assign({
        error: (_, event) => event.data,
      }),
      removeError: assign({
        error: () => null,
      }),
      saveSignedMessage: assign((_, event) => ({
        signedMessage: event.data,
      })),
    },
  }
)

const useJoinModalMachine = (): any => {
  const { id: communityId, urlName } = useCommunity()
  const { account } = useWeb3React()
  const sign = usePersonalSign()
  const dcAuthWindow = useRef<Window>(null)

  const handleMessage =
    (resolve: (value?: any) => void, reject: (value: any) => void) =>
    (event: MessageEvent) => {
      // Conditions are for security and to make sure, the expected messages are being handled
      // (extensions are also communicating with message events)
      if (
        event.isTrusted &&
        event.origin === window.location.origin &&
        "type" in event.data &&
        "data" in event.data
      ) {
        const { data, type } = event.data

        switch (type) {
          case "DC_AUTH_SUCCESS":
            resolve(data)
            break
          case "DC_AUTH_ERROR":
            reject(data)
            break
          default:
            // Should never happen, since we are only processing events that are originating from us
            reject({
              error: "Invalid message",
              errorDescription:
                "Recieved invalid message from authentication window",
            })
        }

        dcAuthWindow.current.close()
        window.removeEventListener("message", handleMessage(resolve, reject))
      }
    }

  const [state, send] = useMachine(joinModalMachine, {
    actions: {
      openDiscordAuthWindow: (context) => {
        dcAuthWindow.current = window.open(
          `https://discord.com/api/oauth2/authorize?client_id=${
            process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
          }&response_type=token&scope=identify&redirect_uri=${
            process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
          }&state=${JSON.stringify({
            urlName,
            addressSignedMessage: context.signedMessage,
            communityId,
          })}`,
          "dc_auth",
          `height=750,width=600,scrollbars`
        )
      },
    },
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),
      dcAuth: () =>
        new Promise((resolve, reject) => {
          window.addEventListener("message", handleMessage(resolve, reject))
        }),
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useJoinModalMachine
