import { Button, useDisclosure } from "@chakra-ui/react"
import type { PlatformButtonProps as Props } from "../types"
import LeaveModal from "./LeaveModal"
import JoinModal from "./JoinModal"
import platformsData from "../platformsData"

const PlatformButton = ({ communityId, isMember, platform }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logo: Logo } = platformsData[platform]

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={platform}
        fontWeight="medium"
        leftIcon={<Logo />}
        variant={isMember ? "outline" : "solid"}
      >
        {`${isMember ? "Leave" : "Join"} ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        }`}
      </Button>
      {isMember ? (
        <LeaveModal
          platform={platform}
          communityId={communityId}
          isOpen={isOpen}
          onClose={onClose}
        />
      ) : (
        <JoinModal
          platform={platform}
          communityId={communityId}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  )
}

export default PlatformButton
