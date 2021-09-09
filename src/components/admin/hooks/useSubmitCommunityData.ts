import { useRouter } from "next/router"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import useSubmitMachine from "./useSubmitMachine"

const useSubmitCommunityData = <FormDataType>(
  method: "POST" | "PATCH",
  callback?: () => Promise<void>
) => {
  const { communityData } = useCommunityData()
  const router = useRouter()

  const fetchService = (_context, { data }: SignEvent<FormDataType>) =>
    fetch(
      method === "PATCH"
        ? `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}`
        : `${process.env.NEXT_PUBLIC_API}/community`,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    )

  const redirectAction = async ({ urlName }: ContextType) => {
    router.push(`/${urlName}/info`)
  }

  return useSubmitMachine(
    method === "POST"
      ? "Community added! You're being redirected to it's page"
      : "Community updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    callback ?? redirectAction
  )
}

export default useSubmitCommunityData
