import { useMachine } from "@xstate/react"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import type { FormData, Level } from "pages/[community]/admin/community"
import { assign, createMachine, DoneInvokeEvent, EventObject } from "xstate"
import convertMonthsToMs from "../utils/convertMonthsToMs"
import useCommunityData from "./useCommunityData"
import useShowErrorToast, { ApiError } from "./useShowErrorToast"

// Replacing specific values in the JSON with undefined, so we won't send them to the API
const replacer = (key, value) => {
  if (
    key === "isDCEnabled" ||
    key === "isTGEnabled" ||
    value === null ||
    Number.isNaN(value)
  )
    return undefined
  return value
}

type ContextType = {
  urlName: string
}

// Successful data-flow events
type InitialEvent<FormDataType> = EventObject & {
  data: FormDataType
}
type SignEvent<FormDataType> = DoneInvokeEvent<
  FormDataType & {
    addressSignedMessage: string
    urlName: string // So we can do data.urlName to redirect
  }
>
type FetchEvent = DoneInvokeEvent<Response | Response[]>

// Error events
type SignError = DoneInvokeEvent<Error>
type APIError = DoneInvokeEvent<{ errors: ApiError[] }>
type ErrorEvent = SignError | APIError

// TODO: include a DELETE flow here?
const submitLevelsDataMachine = <FormDataType>() =>
  createMachine<
    ContextType,
    InitialEvent<FormDataType> | SignEvent<FormDataType> | FetchEvent | ErrorEvent
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
        parseError: (_, event: FetchEvent) => {
          if (Array.isArray(event.data)) {
            return Promise.all(event.data.map((res) => res.json())).catch(() =>
              Promise.reject(new Error("Network error"))
            )
          }
          return event.data
            .json()
            .catch(() => Promise.reject(new Error("Network error")))
        },
      },
      guards: {
        fetchSuccessful: (_context, event: FetchEvent) => {
          if (Array.isArray(event.data)) return event.data.every(({ ok }) => !!ok)
          return !!event.data.ok
        },
        fetchFailed: (_context, event: FetchEvent) => {
          if (Array.isArray(event.data)) return event.data.some(({ ok }) => !ok)
          return !event.data.ok
        },
      },
      actions: {
        saveUrlName: assign((_, { data: { urlName } }: SignEvent<FormDataType>) => ({
          urlName,
        })),
      },
    }
  )

const useSubmitLevelsData = <FormDataType>(
  method: "POST" | "PATCH" // | "DELETE",
) => {
  const router = useRouter()
  const communityData = useCommunityData()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const sign = usePersonalSign()
  const [state, send] = useMachine(submitLevelsDataMachine<FormDataType>(), {
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
      fetch: (_context, { data }: SignEvent<FormDataType & { levels: Level[] }>) => {
        if (method === "POST" && communityData.id)
          fetch(
            `${process.env.NEXT_PUBLIC_API}/community/levels/${communityData.id}`,
            {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...data }, replacer),
            }
          )
        else {
          const { addressSignedMessage } = data
          const { levelUpdatePromises, levelsToCreate } = data.levels.reduce(
            (
              acc: {
                levelUpdatePromises: Promise<Response>[]
                levelsToCreate: Partial<Level>[]
              },
              level
            ) => {
              if (level.id) {
                // Already existing levels need to be updated
                const { id } = level
                const payload = level
                // Don't need IDs for PATCH
                delete payload.id
                delete payload.tokenSymbol

                acc.levelUpdatePromises.push(
                  fetch(`${process.env.NEXT_PUBLIC_API}/community/level/${id}`, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...payload,
                      addressSignedMessage,
                    }),
                  })
                )
                return acc
              }
              // New levels should be created
              acc.levelsToCreate.push(level)
              return acc
            },
            {
              levelUpdatePromises: [],
              levelsToCreate: [],
            }
          )

          const promises = levelUpdatePromises
          if (levelsToCreate.length > 0)
            promises.push(
              fetch(
                `${process.env.NEXT_PUBLIC_API}/community/levels/${communityData.id}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    levels: levelsToCreate,
                    addressSignedMessage,
                  }),
                }
              )
            )

          return Promise.all(promises)
        }
      },
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
            "Level(s) added! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
          status: "success",
          duration: 2000,
        }),
      redirect: () =>
        fetch(`/api/preview?urlName=${communityData.urlName}`)
          .then((res) => res.json())
          .then((cookies: string[]) => {
            cookies.forEach((cookie: string) => {
              document.cookie = cookie
            })
            setTimeout(() => {
              router.push(`/${communityData.urlName}/community`)
            }, 2000)
          }),
    },
  })

  const onSubmit = (_data: FormData) => {
    const data = _data
    data.levels?.forEach((level, i) => {
      if (!level.stakeTimelockMs) return
      const timeLock = level.stakeTimelockMs as number
      data[i].stakeTimelockMs = convertMonthsToMs(timeLock).toString()
    })
    send("SIGN", { data })
  }

  return { onSubmit, loading: ["sign", "fetch", "parseError"].some(state.matches) }
}

export default useSubmitLevelsData
