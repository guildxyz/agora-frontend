import { useToast } from "@chakra-ui/react"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import clearUndefinedData from "../utils/clearUndefinedData"

const useSubmitLevelsData = (
  setLoading: (loading: boolean) => void,
  method: "POST" | "PATCH" | "DELETE",
  communityId: number = null
) => {
  const toast = useToast()
  const sign = usePersonalSign()

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
        stakeTimelockMs: convertMonthsToMs(timeLock),
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

              if (response.status !== 200 && response.status !== 201) {
                toast({
                  title: "Error",
                  description:
                    "An error occurred while adding levels to your community",
                  status: "error",
                  duration: 4000,
                })
                return
              }

              toast({
                title: "Success!",
                description: "Level(s) added!",
                status: "success",
                duration: 2000,
              })
            })
            .catch(() => {
              setLoading(false)

              toast({
                title: "Error",
                description: "Server error",
                status: "error",
                duration: 4000,
              })
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
            .map((level) =>
              fetch(`${process.env.NEXT_PUBLIC_API}/community/level/${level.id}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...level, addressSignedMessage }),
              })
            )

          // New levels should be created
          const levelsToCreateArray = [...finalData.levels].filter(
            (level) => !level.id
          )
          const levelsToCreate = fetch(
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

          Promise.all([...levelsToUpdate, levelsToCreate])
            .then((responses) => {
              setLoading(false)

              if (
                responses.find((res) => res.status !== 200 && res.status !== 201)
              ) {
                toast({
                  title: "Error",
                  description:
                    "An error occurred while editing the levels of your community",
                  status: "error",
                  duration: 4000,
                })
                return
              }
              toast({
                title: "Success!",
                description: "Level(s) updated!",
                status: "success",
                duration: 2000,
              })
            })
            .catch(() => {
              setLoading(false)

              toast({
                title: "Error",
                description: "Server error",
                status: "error",
                duration: 4000,
              })
            })
        }
      })
      .catch(() => {
        setLoading(false)

        toast({
          title: "Error",
          description: "You must sign the message to verify your address!",
          status: "error",
          duration: 4000,
        })
      })
  }

  return onSubmit
}

export default useSubmitLevelsData
