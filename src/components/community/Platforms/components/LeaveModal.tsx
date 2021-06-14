import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import type { JoinOrLeavePlatformProps as Props } from "../types"
import platformsData from "../platformsData"

const LeaveModal = ({
  platform,
  communityId,
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const { account } = useWeb3React()
  const {
    leave: { title, description, buttonText },
  } = platformsData[platform]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            w="100%"
            colorScheme="blue"
            size="lg"
            // eslint-disable-next-line no-console
            onClick={() => console.log({ address: account, platform, communityId })}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
