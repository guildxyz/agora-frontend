import { Modal as ChakraModal } from "@chakra-ui/react"
import { useAllowance } from "../hooks/useAllowance"

const Modal = ({ isOpen, onClose, children }) => {
  const { send } = useAllowance()

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  return (
    <ChakraModal isOpen={isOpen} onClose={closeModal}>
      {children}
    </ChakraModal>
  )
}

export default Modal
