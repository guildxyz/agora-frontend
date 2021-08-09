import { Box, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useEffect } from "react"

const newNamedError = (name: string, message: string) => {
  const error = new Error(message)
  error.name = name
  return error
}

const fetchUserID = async (tokenType: string, accessToken: string) => {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  }).catch(() => {
    throw newNamedError("Network error", "Unable to connect to Discord server")
  })

  if (!response.ok)
    throw newNamedError(
      "Discord error",
      "There was an error, while fetching the user data"
    )

  const { id } = await response.json()
  return id
}

const fetchJoinPlatform = async (
  platformUserId: string,
  communityId: string,
  addressSignedMessage: string
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/joinPlatform`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platform: "DISCORD",
      platformUserId,
      communityId,
      addressSignedMessage,
    }),
  }).catch(() => {
    throw newNamedError("Network error", "Unable to connect to server")
  })

  if (!response.ok)
    throw newNamedError(
      "Failed to get invite link",
      "Couldn't fetch the invite link from from the backend"
    )

  const inviteData = await response.json()
  return inviteData
}

const DCAuth = () => {
  const router = useRouter()

  useEffect(() => {
    // We navigate to the index page if the dcauth page is used incorrectly
    // For example if someone just manually goes to /dcauth
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

    fetchUserID(tokenType, accessToken)
      .then((id) => {
        fetchJoinPlatform(id, communityId, addressSignedMessage).then(
          (data) =>
            window.opener &&
            window.opener.postMessage({ type: "DC_AUTH_SUCCESS", data }, target)
        )
      })
      .catch(({ name, message }) => sendError(name, message))
  }, [router])

  return (
    <Box p="6">
      <Heading size="md">You're being redirected</Heading>
      <Text>
        Closing the authentication window and taking you back to the site...
      </Text>
    </Box>
  )
}

export default DCAuth
