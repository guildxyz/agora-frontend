import { AllowanceProvider } from "../Context"
import ModalContent from "./ModalContent"

const Modal = ({ token, isOpen, onClose, children }) => (
  <AllowanceProvider token={token}>
    <ModalContent isOpen={isOpen} onClose={onClose}>
      {children}
    </ModalContent>
  </AllowanceProvider>
)

export default Modal
