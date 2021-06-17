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
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import useLeaveModalMachine from "../hooks/useLeaveModalMachine"
import platformsContent from "../platformsContent"
import processLeavePlatformMessage from "../utils/processLeavePlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const LeaveModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const [state, send] = useLeaveModalMachine(platform)
  const {
    leave: { title, membershipDescription, leaveDescription, buttonText },
  } = platformsContent[platform]

  const closeModal = () => {
    send("MODAL_CLOSED")
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={processLeavePlatformMessage}
          />
          <VStack spacing={5}>
            <Text>{membershipDescription}</Text>
            <Text>{leaveDescription}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={state.value === "loading"}
            loadingText="In progress"
            w="100%"
            colorScheme="primary"
            size="lg"
            onClick={() => send("LEAVE_IN_PROGRESS")}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
