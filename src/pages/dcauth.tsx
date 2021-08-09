import Layout from "components/common/Layout"
import { useEffect } from "react"

const DCAuth = () => {
  useEffect(() => {
    // If the main page is closed before navigating to /dcauth
    if (!window.opener) {
      console.error(
        "Do not refresh or close Agora, while authenticating through Discord"
      )
      window.close()
    }

    // If the main page gets closed while on the /dcauth page
    window.opener.onclose = () => {
      console.error(
        "Do not refresh or close Agora, while authenticating through Discord"
      )
      window.close()
    }

    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const [accessToken, tokenType, error, errorDescription, state] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
      fragment.get("state"),
    ]

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
