import {
  Modal,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"

type Props = {
  isOpen: boolean
  onClose: () => void
  children: JSX.Element
}

const AppModal = ({ isOpen, onClose, children }: Props): JSX.Element => {
  const MotionModalContent = motion(ModalContent)
  const modalDrag: boolean | "x" | "y" = useBreakpointValue({ base: "y", md: false })
  const modalInitialBottom = useBreakpointValue({ base: -100, md: 0 })

  const handleModalDrag = (_, info) => {
    if (info.offset.y > 80) {
      onClose()
    }
  }

  return (
    <Modal motionPreset="none" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transitionDuration="0.2"
      />
      <MotionModalContent
        initial={{ opacity: 0, bottom: modalInitialBottom }}
        animate={{ opacity: 1, bottom: 0 }}
        exit={{ opacity: 0, bottom: modalInitialBottom }}
        transition={{ duration: 0.2 }}
        drag={modalDrag}
        dragConstraints={{ top: 0, bottom: 80 }}
        onDragEnd={handleModalDrag}
      >
        {children}
      </MotionModalContent>
    </Modal>
  )
}

export default AppModal
