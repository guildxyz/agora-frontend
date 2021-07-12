import { Modal } from "@chakra-ui/react"
import { useAllowance } from "../Context"

const ModalContent = ({ isOpen, onClose, children }) => {
  const { send } = useAllowance()

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {children}
    </Modal>
  )
}

export default ModalContent
