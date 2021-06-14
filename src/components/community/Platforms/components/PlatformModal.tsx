import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import type { ModalProps as Props } from "../types"
import JoinPlatform from "./JoinPlatform"
import LeavePlatform from "./LeavePlatform"

const platformsData = {
  telegram: {
    join: {
      title: "Join Telegram group",
      description:
        "To generate your invite link, first you have to sign a message with your wallet.",
    },
    leave: {
      title: "Leave Telegram group",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      buttonText: "Leave group",
    },
  },
  discord: {
    join: {
      title: "Join Discord server",
      description:
        "To generate your invite link, first you have to sign a message with your wallet.",
    },
    leave: {
      title: "Leave Discord server",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      buttonText: "Leave server",
    },
  },
}

const PlatformModal = ({
  isOpen,
  onClose,
  communityId,
  platform,
  isMember,
}: Props): JSX.Element => {
  const { account } = useWeb3React()
  const {
    join: { title: joinTitle, description: joinDescription },
    leave: {
      title: leaveTitle,
      description: leaveDescription,
      buttonText: leaveButtonText,
    },
  } = platformsData[platform]

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ address: account, communityId, platform })
  }, [account, communityId, platform])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {!isMember && (
          <JoinPlatform
            platform={platform}
            communityId={communityId}
            title={joinTitle}
            description={joinDescription}
          />
        )}
        {isMember && (
          <LeavePlatform
            platform={platform}
            communityId={communityId}
            title={leaveTitle}
            description={leaveDescription}
            buttonText={leaveButtonText}
          />
        )}
      </ModalContent>
    </Modal>
  )
}

export default PlatformModal
