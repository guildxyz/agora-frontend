import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/[community]/common/Context"
import { useEffect, useRef } from "react"
import { DiscordError, Machine } from "temporaryData/types"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "./usePersonalSign"

export type ContextType = {
  error: DiscordError
  id: string
}

type AuthEvent = DoneInvokeEvent<{ id: string }>
type ErrorEvent = DoneInvokeEvent<DiscordError>

// When this machine reaches its final state, the discord id of the authenticated user is available in its context
const dcAuthMachine = createMachine<ContextType, AuthEvent | ErrorEvent>(
  {
    initial: "idle",
    context: {
      error: null,
      id: null,
    },
    states: {
      idle: {
        on: { AUTH: "authenticating" },
      },
      authenticating: {
        entry: "openWindow",
        invoke: {
          src: "auth",
          onDone: "notification",
          onError: "error",
        },
        exit: "closeWindow",
      },
      error: {
        entry: "setError",
        on: { AUTH: "authenticating", CLOSE_MODAL: "idle" },
        exit: "removeError",
      },
      notification: {
        entry: "setId",
        on: {
          CLOSE_MODAL: "success",
          HIDE_NOTIFICATION: "success",
        },
      },
      success: {},
    },
    on: {
      RESET: {
        target: "idle",
      },
    },
  },
  {
    actions: {
      setId: assign<ContextType, AuthEvent>({
        id: (_, event) => event.data.id,
      }),
      setError: assign<ContextType, ErrorEvent>({
        error: (_, event) => event.data,
      }),
      removeError: assign<ContextType>({ error: null }),
    },
  }
)

const useDCAuthMachine = (): Machine<ContextType> => {
  const { urlName } = useCommunity()
  const { account } = useWeb3React()
  const sign = usePersonalSign()
  const authWindow = useRef<Window>(null)
  const listener = useRef<(event: MessageEvent) => void>()

  const handleMessage =
    (resolve: (value?: any) => void, reject: (value: any) => void) =>
    (event: MessageEvent) => {
      // Conditions are for security and to make sure, the expected messages are being handled
      // (extensions are also communicating with message events)
      if (
        event.isTrusted &&
        event.origin === window.location.origin &&
        typeof event.data === "object" &&
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
      }
    }

  const [state, send] = useMachine(dcAuthMachine, {
    actions: {
      openWindow: () => {
        authWindow.current = window.open(
          `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${urlName}`,
          "dc_auth",
          `height=750,width=600,scrollbars`
        )

        // Could only capture a "beforeunload" event if the popup and the opener would be on the same domain
        const timer = setInterval(() => {
          if (authWindow.current.closed) {
            clearInterval(timer)
            window.postMessage(
              {
                type: "DC_AUTH_ERROR",
                data: {
                  error: "Authorization rejected",
                  errorDescription:
                    "Please try again and authenticate your Discord account in the popup window",
                },
              },
              window.origin
            )
          }
        }, 500)
      },
      closeWindow: () => {
        window.removeEventListener("message", listener.current)
        listener.current = null
        authWindow.current.close()
      },
    },
    services: {
      sign: () => sign("Please sign this message to verify your address"),
      auth: () =>
        new Promise((resolve, reject) => {
          listener.current = handleMessage(resolve, reject)
          window.addEventListener("message", listener.current)
        }),
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useDCAuthMachine
