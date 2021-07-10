import {
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import { processMetaMaskError } from "utils/processMetaMaskError"
import platformsContent from "../../platformsContent"
import useLeaveModalMachine from "./hooks/useLeaveModalMachine"
import AppModal from "components/common/AppModal"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const LeaveModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const {
    leave: { title, membershipDescription, leaveDescription, buttonText },
  } = platformsContent[platform]
  const [state, send] = useLeaveModalMachine(platform)

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }
  return (
    <AppModal isOpen={isOpen} onClose={closeModal}>
      <>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error error={state.context.error} processError={processMetaMaskError} />
          <VStack spacing={5}>
            <Text>{membershipDescription}</Text>
            <Text>{leaveDescription}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            isLoading={state.value === "fetching"}
            loadingText="In progress"
            onClick={() => send("LEAVE")}
          >
            {buttonText}
          </ModalButton>
        </ModalFooter>
      </>
    </AppModal>
  )
}

export default LeaveModal
