import { useMachine } from "@xstate/react"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { assign, createMachine, DoneInvokeEvent, EventObject } from "xstate"
import type { ApiError } from "./useShowErrorToast"
import useShowErrorToast from "./useShowErrorToast"

type ContextType = any

// Successful data-flow events
interface InitialEvent<FormDataType> extends EventObject {
  data: FormDataType
}
type SignEvent<FormDataType> = DoneInvokeEvent<
  FormDataType & {
    addressSignedMessage: string
    urlName: string // So we can do data.urlName to redirect
  }
>

// Error events
type SignError = DoneInvokeEvent<Error>
type FetchError = DoneInvokeEvent<Response>
type APIError = DoneInvokeEvent<{ errors: ApiError[] }>
type ErrorEvent = SignError | FetchError | APIError

const submitCommunityDataMachine = <FormDataType>() =>
  createMachine<
    ContextType,
    InitialEvent<FormDataType> | SignEvent<FormDataType> | ErrorEvent
  >(
    {
      initial: "idle",
      states: {
        idle: {
          on: {
            SIGN: "sign",
          },
        },
        sign: {
          invoke: {
            src: "sign",
            onDone: "fetch",
            onError: "error",
          },
        },
        fetch: {
          entry: "saveUrlName",
          invoke: {
            src: "fetch",
            onDone: [
              {
                target: "success",
                cond: "fetchSuccessful",
              },
              {
                target: "parseError",
                cond: "fetchFailed",
              },
            ],
            onError: "error",
          },
        },
        success: {
          entry: ["showSuccessToast", "redirect"],
        },
        parseError: {
          invoke: {
            src: "parseError",
            onDone: "error",
            onError: "error",
          },
        },
        error: {
          entry: "showErrorToast",
          on: {
            SIGN: "sign",
          },
        },
      },
    },
    {
      services: {
        parseError: (_, event: FetchError) =>
          event.data.json().catch(() => Promise.reject(new Error("Network error"))),
      },
      guards: {
        fetchSuccessful: (_context, event: FetchError) => !!event.data.ok,
        fetchFailed: (_context, event: FetchError) => !event.data.ok,
      },
      actions: {
        saveUrlName: assign((_, { data: { urlName } }: SignEvent<FormDataType>) => ({
          urlName,
        })),
      },
    }
  )

const useSubmitCommunityData = <FormDataType>(
  method: "POST" | "PATCH",
  id = null
) => {
  const fetchUrl =
    method === "PATCH"
      ? `${process.env.NEXT_PUBLIC_API}/community/${id}`
      : `${process.env.NEXT_PUBLIC_API}/community`
  const router = useRouter()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const sign = usePersonalSign()
  const [state, send] = useMachine(submitCommunityDataMachine<FormDataType>(), {
    services: {
      sign: async (_, { data }: InitialEvent<FormDataType>) => {
        const addressSignedMessage = await sign(
          "Please sign this message to verify your address"
        ).catch(() =>
          Promise.reject(
            new Error("You must sign the message to verify your address!")
          )
        )
        return { ...data, addressSignedMessage }
      },
      fetch: (_context, { data }: SignEvent<FormDataType>) =>
        fetch(fetchUrl, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
    },
    actions: {
      showErrorToast: (_context, { data: error }: SignError | APIError) => {
        if (error instanceof Error) showErrorToast(error.message)
        else showErrorToast(error.errors)
      },
      showSuccessToast: () =>
        toast({
          title: "Success!",
          description:
            method === "POST"
              ? "Community added! You're being redirected to it's page"
              : "Community updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
          status: "success",
          duration: 2000,
        }),
      redirect:
        method === "PATCH"
          ? ({ urlName }) =>
              fetch(`/api/preview?urlName=${urlName}`)
                .then((res) => res.json())
                .then((cookies: string[]) => {
                  cookies.forEach((cookie: string) => {
                    document.cookie = cookie
                  })
                  router.push(`/${urlName}`)
                })
          : ({ urlName }) => setTimeout(() => router.push(`/${urlName}`), 2000),
    },
  })

  const onSubmit = (data: FormDataType) => send("SIGN", { data })

  return { onSubmit, loading: ["sign", "fetch"].some(state.matches) }
}

export default useSubmitCommunityData
