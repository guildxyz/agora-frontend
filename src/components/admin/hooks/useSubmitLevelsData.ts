import { useRouter } from "next/router"
import convertMonthsToMs from "../utils/convertMonthsToMs"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import type { FormData, Level } from "./useSubmitMachine"
import useSubmitMachine from "./useSubmitMachine"

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

const useSubmitLevelsData = (method: "POST" | "PATCH", callback: () => void) => {
  const router = useRouter()
  const { communityData } = useCommunityData()

  const fetchService = (
    _context: ContextType,
    { data }: SignEvent<FormData & { levels: Level[] }>
  ) => {
    if (method === "POST" && communityData?.id)
      return fetch(
        `${process.env.NEXT_PUBLIC_API}/community/levels/${communityData?.id}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data }, replacer),
        }
      )
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
          `${process.env.NEXT_PUBLIC_API}/community/levels/${communityData?.id}`,
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

  const redirectAction = async () => {
    if (typeof callback === "function") {
      callback()
    } else {
      router.push(`/${communityData?.urlName}/community`)
    }
  }

  const preprocess = (_data: FormData) => {
    const data = _data
    data.levels?.forEach((level, i) => {
      if (!level.requirements[0]?.stakeTimelockMs) return
      const timeLock = level.requirements[0].stakeTimelockMs as number
      data[i].requirements[0].stakeTimelockMs =
        convertMonthsToMs(timeLock).toString()
    })
    return data
  }

  return useSubmitMachine<FormData>(
    method === "POST" ? "Level(s) added!" : "Level(s) updated!",
    fetchService,
    redirectAction,
    preprocess
  )
}

export default useSubmitLevelsData
