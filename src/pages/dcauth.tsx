import Layout from "components/common/Layout"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

const DCAuth = () => {
  const router = useRouter()

  useEffect(() => {
    // We navigate to the index page if the dcauth page is used incorrectly
    if (!window.location.hash) router.push("/")

    const fragment = new URLSearchParams(window.location.hash.slice(1))

    if (!fragment.has("state")) router.push("/")

    let state = null
    try {
      state = JSON.parse(fragment.get("state"))
    } catch (_) {
      router.push("/")
    }

    if (
      !("urlName" in state) ||
      !("addressSignedMessage" in state) ||
      !("communityId" in state) ||
      ((!fragment.has("access_token") || !fragment.has("token_type")) &&
        (!fragment.has("error") || !fragment.has("error_description")))
    )
      router.push("/")

    const [accessToken, tokenType, error, errorDescription] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("error"),
      fragment.get("error_description"),
    ]

    const { urlName, addressSignedMessage, communityId } = state

    const target = `${window.location.origin}/${urlName}`

    const sendError = (e: string, d: string) =>
      window.opener &&
      window.opener.postMessage(
        {
          type: "DC_AUTH_ERROR",
          data: {
            error: e,
            errorDescription: d,
          },
        },
        target
      )

    if (error) sendError(error, errorDescription)

    fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json()
        sendError(
          "Failed to fetch user id",
          "There was an error, while fetching the user data"
        )
      })
      .then(({ id }) => {
        fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform: "DISCORD",
            platformUserId: id,
            communityId,
            addressSignedMessage,
          }),
        })
          .then((res) => {
            if (res.ok) return res.json()
            sendError(
              "Failed to get invite link",
              "Couldn't fetch the invite link from from the backend"
            )
          })
          .then(
            (data) =>
              window.opener &&
              window.opener.postMessage({ type: "DC_AUTH_SUCCESS", data }, target)
          )
          .catch(() => sendError("Network error", "Unable to connect to server"))
      })
      .catch(() => sendError("Network error", "Unable to connect to Discord server"))
  }, [router])

  return <Layout title="Authentication successful">{null}</Layout>
}

export default DCAuth
