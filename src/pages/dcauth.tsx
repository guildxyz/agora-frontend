import Layout from "components/common/Layout"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

const DCAuth = () => {
  const router = useRouter()

  useEffect(() => {
    // Don't even parse the params if there is none
    if (!window.location.hash) router.push("/")

    const fragment = new URLSearchParams(window.location.hash.slice(1))

    // If the params are incorrect
    if (
      !fragment.has("state") ||
      ((!fragment.has("access_token") || !fragment.has("token_type")) &&
        (!fragment.has("error") || !fragment.has("error_description")))
    )
      router.push("/")

    const [accessToken, tokenType, error, errorDescription, state] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
      fragment.get("state"),
    ]

    // If the main page is closed before navigating to /dcauth
    if (!window.opener) {
      console.error(
        "Do not refresh or close Agora, while authenticating through Discord"
      )
      window.close()
      return
    }

    // If the main page gets closed while on the /dcauth page
    window.opener.onclose = () => {
      console.error(
        "Do not refresh or close Agora, while authenticating through Discord"
      )
      window.close()
    }

    const target = `${window.location.origin}/${state}`
    const message = error
      ? {
          type: "DC_AUTH_ERROR",
          data: {
            error,
            errorDescription,
          },
        }
      : {
          type: "DC_AUTH_SUCCESS",
          data: {
            accessToken,
            tokenType,
          },
        }

    window.opener.postMessage(message, target)
  }, [])

  return <Layout title="Authentication successful">{null}</Layout>
}

export default DCAuth
