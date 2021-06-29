import { Button, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { useCommunity } from "components/community/Context"
import LeaveModal from "./LeaveModal"
import JoinModal from "./JoinModal"
import platformsContent from "../platformsContent"

type Props = {
  platform: string
}

const fetchIsMember = async (
  url: string,
  address: string,
  platform: string,
  communityId: number
) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      platform,
      communityId,
    }),
  })
    .then((response) => response.json())
    .then((data) => (typeof data === "boolean" ? data : false))

const PlatformButton = ({ platform }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id: communityId } = useCommunity()
  const { logo: Logo } = platformsContent[platform]
  const shouldFetch = !!account && !!communityId
  const { data: isMember } = useSWR(
    shouldFetch
      ? [
          "http://94.16.109.106:8989/api/user/isMember",
          account,
          platform,
          communityId,
        ]
      : null,
    fetchIsMember,
    { initialData: false }
  )

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={platform}
        fontWeight="medium"
        leftIcon={<Logo />}
        variant={isMember ? "outline" : "solid"}
        disabled={!account}
      >
        {`${isMember ? "Leave" : "Join"} ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        }`}
      </Button>
      {isMember ? (
        <LeaveModal {...{ platform, isOpen, onClose }} />
      ) : (
        <JoinModal {...{ platform, isOpen, onClose }} />
      )}
    </>
  )
}

export default PlatformButton
