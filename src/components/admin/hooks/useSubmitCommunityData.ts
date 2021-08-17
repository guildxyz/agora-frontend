import { useToast } from "@chakra-ui/react"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import { useRouter } from "next/router"
import clearUndefinedData from "../utils/clearUndefinedData"

const useSubmitCommunityData = (method: "POST" | "PATCH") => {
  const router = useRouter()
  const toast = useToast()
  const sign = usePersonalSign()

  const onSubmit = (data: any) => {
    sign("Please sign this message to verify your address")
      .then((addressSignedMessage) => {
        const finalData = clearUndefinedData(data)
        fetch(`${process.env.NEXT_PUBLIC_API}/community`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...finalData, addressSignedMessage }),
        })
          .then((response) => {
            if (response.status !== 201) {
              toast({
                title: "Error",
                description: `An error occurred while ${
                  method === "POST" ? "creating" : "updating"
                } your community`,
                status: "error",
                duration: 4000,
              })
              return
            }

            toast({
              title: "Success!",
              description:
                method === "POST"
                  ? "Community added! You'll be redirected to the admin page."
                  : "Community updated!",
              status: "success",
              duration: 2000,
            })

            if (method === "POST") {
              setTimeout(() => {
                router.push(`/${finalData.urlName}/admin/community`)
              }, 2000)
            }
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Server error",
              status: "error",
              duration: 4000,
            })
          })
      })
      .catch(() => {
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
