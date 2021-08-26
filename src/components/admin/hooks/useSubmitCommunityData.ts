import { useRouter } from "next/router"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useCommunityData from "./useCommunityData"
import useSubmitMachine from "./useSubmitMachine"

const useSubmitCommunityData = <FormDataType>(method: "POST" | "PATCH") => {
  const communityData = useCommunityData()
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

  const redirectAction =
    method === "PATCH"
      ? ({ urlName }: ContextType) =>
          fetch(`/api/preview?urlName=${urlName}`)
            .then((res) => res.json())
            .then((cookies: string[]) => {
              cookies.forEach((cookie: string) => {
                document.cookie = cookie
              })
              router.push(`/${urlName}`)
            })
      : ({ urlName }: ContextType) =>
          new Promise<void>(() =>
            setTimeout(() => {
              router.push(`/${urlName}`)
            }, 2000)
          )

  return useSubmitMachine(fetchService, redirectAction)
}

export default useSubmitCommunityData
