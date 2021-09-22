import { useCommunity } from "components/[community]/common/Context"
import { useRouter } from "next/router"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useSubmitMachine from "./useSubmitMachine"

const useSubmitCommunityData = <FormDataType>(
  method: "POST" | "PATCH",
  callback?: () => Promise<void>
) => {
  /**
   * The communityData is only available on the [community]/admin pages and not on
   * the register page (there is no community), but we only use this value if the
   * method is POST, and that means that the hook was called from the admin page
   */
  const communityData = useCommunity()
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
      : "Community updated!",
    fetchService,
    callback ?? redirectAction
  )
}

export default useSubmitCommunityData
