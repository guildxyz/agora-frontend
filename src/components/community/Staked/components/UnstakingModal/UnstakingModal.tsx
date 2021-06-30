import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Center,
} from "@chakra-ui/react"
import { ArrowCircleUp } from "phosphor-react"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import useUnstakingModalMachine from "./hooks/useUnstakingModalMachine"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const UnstakingModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const [state, send] = useUnstakingModalMachine()

  const closeModal = () => {
    send("RESET")
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.value === "success" ? "Transaction submitted" : "Unstake tokens"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={() => ({
              title: "TODO",
              description: "TODO",
            })}
          />
          {state.value === "success" ? (
            <>
              <Center>
                <ArrowCircleUp
                  size="50%"
                  color="var(--chakra-colors-primary-500)"
                  weight="thin"
                />
              </Center>
              <Text fontWeight="medium" mt="8" mb="4">
                Avarage transaction time is 2 minutes. You’ll be notified when it
                succeeds.
              </Text>
            </>
          ) : (
            <Text>
              By unstaking you’ll lose access to the relevant levels. You can always
              stake back, but then the timelock will restart.
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          {state.value === "success" ? (
            <ModalButton onClick={closeModal}>Close</ModalButton>
          ) : (
            <ModalButton
              isLoading={state.value === "loading"}
              loadingText="Waiting confirmation"
              onClick={() => send("UNSTAKE")}
            >
              Confirm unstake
            </ModalButton>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UnstakingModal
