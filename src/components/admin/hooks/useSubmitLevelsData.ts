import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useState } from "react"
import clearUndefinedData from "../utils/clearUndefinedData"
import useShowErrorToast from "./useShowErrorToast"

const useSubmitLevelsData = (
  method: "POST" | "PATCH" | "DELETE",
  communityId: number = null,
  successCallback: () => void = () => {}
) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const sign = usePersonalSign()
  const [loading, setLoading] = useState(false)

  // Helper method for converting month(s) to ms
  const convertMonthsToMs = (months: number) =>
    Math.round(months / 3.8026486208174e-10)

  const onSubmit = (data: any) => {
    setLoading(true)

    const editedData = { ...data }

    // Won't send these to the backend
    delete editedData.isDCEnabled
    delete editedData.isTGEnabled

    // Converting timeLock to ms for every level
    editedData.levels = editedData.levels?.map((level) => {
      const timeLock = level.stakeTimelockMs
      if (!timeLock) {
        return clearUndefinedData(level)
      }

      return {
        ...clearUndefinedData(level),
        stakeTimelockMs: convertMonthsToMs(timeLock).toString(),
      }
    })

    const finalData: any = clearUndefinedData(editedData)

    // Signing the message, and sending the data to the API
    sign("Please sign this message to verify your address")
      .then((addressSignedMessage) => {
        // POST
        if (method === "POST" && communityId) {
          fetch(`${process.env.NEXT_PUBLIC_API}/community/levels/${communityId}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...finalData, addressSignedMessage }),
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

          // Already existing levels need to be updated
          const levelsToUpdate = [...finalData.levels]
            .filter((level) => level.id)
            .map((level) => {
              // Don't need IDs for PATCH
              const payload = { ...level }
              delete payload.id
              delete payload.tokenSymbol

              return fetch(
                `${process.env.NEXT_PUBLIC_API}/community/level/${level.id}`,
                {
                  method,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...payload, addressSignedMessage }),
                }
              )
            })

          // New levels should be created
          const levelsToCreateArray = [...finalData.levels].filter(
            (level) => !level.id
          )

          const levelsToCreate =
            levelsToCreateArray?.length > 0
              ? fetch(
                  `${process.env.NEXT_PUBLIC_API}/community/levels/${communityId}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      levels: levelsToCreateArray,
                      addressSignedMessage,
                    }),
                  }
                )
              : null

          const promises = [...levelsToUpdate]

          if (levelsToCreate) {
            promises.concat(levelsToCreate)
          }

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
