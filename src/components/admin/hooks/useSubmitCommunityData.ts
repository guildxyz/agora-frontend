import { useRouter } from "next/router"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import useSubmitMachine from "./useSubmitMachine"

// Converting URLs to the proper format before submitting them to the API
const replacer = (key, value) => {
  if (key === "url" && value?.length > 0) return `https://${value}`
  return value
}

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
        body: JSON.stringify(data, replacer),
      }
    )

  const redirectAction = async ({ urlName }: ContextType) => {
    router.push(`/${urlName}/info`)
  }

  return useSubmitMachine(
    method === "POST"
      ? "Community added! You're being redirected to it's page"
      : "Community updated!",
    fetchService,
    callback ?? redirectAction
  )
}

export default useSubmitCommunityData
