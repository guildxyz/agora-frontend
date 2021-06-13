import { Button, useDisclosure } from "@chakra-ui/react"
import PlatformModal from "./PlatformModal"
import type { PlatformButtonProps as Props } from "../types"

const PlatformButton = ({
  logo: Logo,
  communityId,
  isMember,
  platform,
  communityType,
}: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
      <PlatformModal
        isOpen={isOpen}
        onClose={onClose}
        communityId={communityId}
        platform={platform}
        communityType={communityType}
        isMember={isMember}
      />
    </>
  )
}

export default PlatformButton
