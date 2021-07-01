import { Button, useDisclosure } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import LeaveModal from "../LeaveModal"
import JoinModal from "../JoinModal"
import platformsContent from "../../platformsContent"
import useIsMember from "./hooks/useIsMember"
import useContainerRef from "components/community/hooks/useContainerRef"

type Props = {
  platform: string
}

const PlatformButton = ({ platform }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logo: Logo } = platformsContent[platform]
  const isMember = useIsMember(platform)
  const containerRef = useContainerRef()

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
        <LeaveModal
          {...{
            portalProps: { containerRef, children: false },
            platform,
            isOpen,
            onClose,
          }}
        />
      ) : (
        <JoinModal
          {...{
            portalProps: { containerRef, children: false },
            platform,
            isOpen,
            onClose,
          }}
        />
      )}
    </>
  )
}

export default PlatformButton
