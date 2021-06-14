import { Button, useDisclosure } from "@chakra-ui/react"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import PlatformModal from "./PlatformModal"
import type { PlatformButtonProps as Props } from "../types"

const platformLogos = {
  telegram: TelegramLogo,
  discord: DiscordLogo,
}

const PlatformButton = ({ communityId, isMember, platform }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const Logo = platformLogos[platform]

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
        isMember={isMember}
      />
    </>
  )
}

export default PlatformButton
