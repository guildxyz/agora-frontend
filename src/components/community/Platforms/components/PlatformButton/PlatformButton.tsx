import { Button, Box, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import LeaveModal from "../LeaveModal"
import JoinModal from "../JoinModal"
import platformsContent from "../../platformsContent"
import useIsMember from "./hooks/useIsMember"

type Props = {
  platform: string
}

const PlatformButton = ({ platform }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logo: Logo } = platformsContent[platform]
  const isMember = useIsMember(platform)

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
        <Box as="span">{isMember ? "Leave" : "Join"}</Box>
        <Box as="span" display={{ base: "none", sm: "inline" }}>{` ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        }`}</Box>
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
