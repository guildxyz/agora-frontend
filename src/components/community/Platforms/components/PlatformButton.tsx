import { Button, useDisclosure, Tooltip, Box } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import type { PlatformButtonProps as Props } from "../types"
import LeaveModal from "./LeaveModal"
import JoinModal from "./JoinModal"
import platformsData from "../platformsData"

// ! This is a dummy function for the demo !
const isMember = (platform: string) => {
  if (platform === "telegram") {
    return true
  }
  return false
}

const noAccessToAnyLevels = () => false

const tooltipLabel = (account: string) => {
  if (!account) return "Wallet not connected"
  if (noAccessToAnyLevels()) return "You don't have access to any of the levels"
  return ""
}

const PlatformButton = ({ communityId, platform }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logo: Logo } = platformsData[platform]

  return (
    <>
      <Tooltip
        isDisabled={!!account || noAccessToAnyLevels()}
        label={tooltipLabel(account)}
      >
        <Box>
          <Button
            onClick={onOpen}
            colorScheme={platform}
            fontWeight="medium"
            leftIcon={<Logo />}
            variant={isMember(platform) ? "outline" : "solid"}
            disabled={!account}
          >
            {`${isMember(platform) ? "Leave" : "Join"} ${
              platform.charAt(0).toUpperCase() + platform.slice(1)
            }`}
          </Button>
        </Box>
      </Tooltip>
      {isMember(platform) ? (
        <LeaveModal {...{ platform, communityId, isOpen, onClose }} />
      ) : (
        <JoinModal {...{ platform, communityId, isOpen, onClose }} />
      )}
    </>
  )
}

export default PlatformButton
