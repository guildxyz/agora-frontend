import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import clearUndefinedData from "../utils/clearUndefinedData"

const useSubmitCommunityData = (
  setLoading: (loading: boolean) => void, // Could be moved inside hook, and be returned(?)
  method: "POST" | "PATCH",
  id = null
) => {
  const fetchUrl =
    method === "PATCH"
      ? `${process.env.NEXT_PUBLIC_API}/community/${id}`
      : `${process.env.NEXT_PUBLIC_API}/community`
  const router = useRouter()
  const toast = useToast()
  const sign = usePersonalSign()

  const onSubmit = (data: any) => {
    setLoading(true)

    sign("Please sign this message to verify your address")
      .then((addressSignedMessage) => {
        const finalData = clearUndefinedData(data)

        fetch(fetchUrl, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...finalData, addressSignedMessage }),
        })
          .then((response) => {
            setLoading(false)

            if (!response.ok) {
              response.json().then(() => {
                toast({
                  title: "Error",
                  description:
                    "Please make sure that you're sending valid data and you haven't already created a community on Agora Space.",
                  status: "error",
                  duration: 4000,
                })
              })
              return
            }

            toast({
              title: "Success!",
              description:
                method === "POST"
                  ? "Community added! You'll be redirected to the admin page."
                  : "Community updated! It might take some time for the page to update for everyone.",
              status: "success",
              duration: 2000,
            })

            if (method === "PATCH") {
              fetch(`/api/preview?urlName=${finalData.urlName}`)
                .then((res) => res.json())
                .then((cookies: string[]) => {
                  cookies.forEach((cookie: string) => {
                    document.cookie = cookie
                  })

                  router.push(`/${finalData.urlName}`)
                })
            }

            if (method === "POST") {
              setTimeout(() => {
                router.push(`/${finalData.urlName}/admin/community`)
              }, 2000)
            }
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

export default useSubmitCommunityData
