import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import type { ModalProps as Props } from "../types"
import JoinPlatform from "./JoinPlatform"
import LeavePlatform from "./LeavePlatform"

const PlatformModal = ({
  isOpen,
  onClose,
  communityType,
  communityId,
  platform,
  isMember,
}: Props): JSX.Element => {
  const { account } = useWeb3React()

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
            communityType={communityType}
            communityId={communityId}
          />
        )}
        {isMember && (
          <LeavePlatform
            platform={platform}
            communityType={communityType}
            communityId={communityId}
          />
        )}
      </ModalContent>
    </Modal>
  )
}

export default PlatformModal
