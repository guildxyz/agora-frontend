import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import { Link } from "components/common/Link"
import Modal from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import QRCode from "qrcode.react"
import platformsContent from "../../platformsContent"
import useJoinModalMachine from "./hooks/useJoinModalMachine"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent[platform]
  const [state, send] = useJoinModalMachine(platform)

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={processJoinPlatformError}
          />
          {state.value !== "success" ? (
            <Text>{description}</Text>
          ) : (
            <VStack spacing="6">
              <Text>
                The generated link is only active for 15 minutes and is only usable
                once.
              </Text>
              <QRCode size={150} value={state.context.inviteData.inviteLink} />
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {(() => {
            switch (state.value) {
              default:
                return <ModalButton onClick={() => send("SIGN")}>Sign</ModalButton>
              case "signing":
                return <ModalButton isLoading loadingText="Waiting confirmation" />
              case "fetching":
                return (
                  <ModalButton isLoading loadingText="Generating your invite link" />
                )
              case "success":
                return (
                  <Link
                    _hover={{ textDecoration: "none" }}
                    href={state.context.inviteData.inviteLink}
                    isExternal
                  >
                    <ModalButton onClick={onClose}>Join</ModalButton>
                  </Link>
                )
            }
          })()}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinModal
