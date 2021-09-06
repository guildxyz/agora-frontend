import type { FormData } from "pages/[community]/admin/community"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import useSubmitMachine from "./useSubmitMachine"

const useSubmitPlatformsData = (
  telegramChanged: boolean,
  discordChanged: boolean,
  updateLevels: boolean,
  callback: () => void
) => {
  const { communityData } = useCommunityData()

  const fetchService = (_context: ContextType, { data }: SignEvent<any>) => {
    const promises = []

    if (telegramChanged)
      promises.push(
        fetch(
          `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}/platform`,
          {
            method: "patch",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              addressSignedMessage: data.addressSignedMessage,
              platform: "TELEGRAM",
              active: data.isTGEnabled,
            }),
          }
        )
      )

    if (discordChanged)
      promises.push(
        fetch(
          `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}/platform`,
          {
            method: "patch",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              addressSignedMessage: data.addressSignedMessage,
              platform: "DISCORD",
              active: data.isTGEnabled,
              platformId: data.discordServerId,
              inviteChannel: data.inviteChannel,
            }),
          }
        )
      )

    return Promise.all(promises)
  }

  const redirectAction = async () => callback()

  return useSubmitMachine<FormData>(null, fetchService, redirectAction)
}

export default useSubmitPlatformsData
