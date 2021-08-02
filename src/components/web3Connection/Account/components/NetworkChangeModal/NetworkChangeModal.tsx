import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react"
import Modal from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { supportedChains } from "connectors"
import NetworkButton from "./components/NetworkButton"

const NetworkChangeModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Change network</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={3}>
          {supportedChains.map((chain) => (
            <NetworkButton key={chain} chain={chain} />
          ))}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <ModalButton onClick={onClose}>Close</ModalButton>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export default NetworkChangeModal
