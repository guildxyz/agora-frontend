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
// If we end up using: a different type, we won't need this import, instead we will create another type
//                     this type, we might want to renaname it and add to ErrorType in Error.tsx
import type { SignErrorType } from "components/community/Platforms/hooks/usePersonalSign"
import { useCommunity } from "components/community/Context"
import { useWeb3React } from "@web3-react/core"
import useLeaveModalMachine from "../hooks/useLeaveModalMachine"
import platformsContent from "../platformsContent"
import processLeavePlatformMessage from "../utils/processLeavePlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

// ! This is a dummy function for the demo !
// Depending on what the returned error will look like, we might need to add a new type to ErrorType in Error.tsx
const leavePlatform = async (
  address: string,
  platform: string,
  communityId: number
): Promise<SignErrorType | null> => {
  // eslint-disable-next-line no-console
  console.log({ address, platform, communityId })
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          code: 1,
          message: "Not implemented",
        }),
      1000
    )
  })
}

const LeaveModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const [state, send] = useLeaveModalMachine()
  const { id: communityId } = useCommunity()
  const { account } = useWeb3React()
  const {
    leave: { title, membershipDescription, leaveDescription, buttonText },
  } = platformsContent[platform]

  const handleLeavePlatform = () => {
    send("leaveInProgress")
    leavePlatform(account, platform, communityId)
      // eslint-disable-next-line no-console
      .then(() => send("modalClosed"))
      .catch((error) => send({ type: "leaveFailed", error }))
  }

  const closeModal = () => {
    send("modalClosed")
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
            onClick={handleLeavePlatform}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
