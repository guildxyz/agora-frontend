import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useToast from "hooks/useToast"
import type { FormData, Level } from "pages/[community]/admin/community"
import { useState } from "react"
import convertMonthsToMs from "../utils/convertMonthsToMs"
import useShowErrorToast from "./useShowErrorToast"

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

const useSubmitLevelsData = (
  method: "POST" | "PATCH" | "DELETE",
  communityId: number = null,
  successCallback: () => void = () => {}
) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const sign = usePersonalSign()
  const [loading, setLoading] = useState(false)

  const onSubmit = (_data: FormData) => {
    setLoading(true)

    const data = _data

    // Converting timeLock to ms for every level
    data.levels?.forEach((level, i) => {
      if (!level.stakeTimelockMs) return
      const timeLock = level.stakeTimelockMs as number
      data[i].stakeTimelockMs = convertMonthsToMs(timeLock).toString()
    })

    // Signing the message, and sending the data to the API
    sign("Please sign this message to verify your address")
      .then((addressSignedMessage) => {
        // POST
        if (method === "POST" && communityId) {
          fetch(`${process.env.NEXT_PUBLIC_API}/community/levels/${communityId}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, addressSignedMessage }, replacer),
          })
            .then((response) => {
              setLoading(false)

              if (!response.ok) {
                response.json().then((json) => showErrorToast(json.errors))
                return
              }

              toast({
                title: "Success!",
                description:
                  "Level(s) added! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
                status: "success",
                duration: 2000,
              })

              successCallback()
            })
            .catch(() => {
              setLoading(false)
              showErrorToast("Server error")
            })
          return
        }

        // PATCH
        if (method === "PATCH" && communityId) {
          // TODO!
          // Maybe we should create an endpoint for this request, where we can send an array of levels, and it'll update the already existing levels, and add the new ones if needed!

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
                    body: JSON.stringify({ ...payload, addressSignedMessage }),
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
                `${process.env.NEXT_PUBLIC_API}/community/levels/${communityId}`,
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

          Promise.all(promises)
            .then((responses) => {
              setLoading(false)

              const failingResponses = responses.filter(({ ok }) => !ok)

              if (failingResponses.length > 0) {
                failingResponses.forEach((response) => {
                  response.json().then((json) => showErrorToast(json.errors))
                })
                return
              }

              toast({
                title: "Success!",
                description:
                  "Level(s) updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
                status: "success",
                duration: 2000,
              })

              successCallback()
            })
            .catch(() => {
              setLoading(false)
              showErrorToast("Server error")
            })
        }
      })
      .catch(() => {
        setLoading(false)
        showErrorToast("You must sign the message to verify your address!")
      })
  }

  return { onSubmit, loading }
}

export default useSubmitLevelsData
