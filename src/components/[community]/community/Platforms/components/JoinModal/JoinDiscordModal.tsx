import {
  Icon,
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
import Link from "components/common/Link"
import Modal from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { ArrowSquareOut } from "phosphor-react"
import QRCode from "qrcode.react"
import { useEffect } from "react"
import platformsContent from "../../platformsContent"
import AuthButton from "./components/AuthButton"
import useDCAuthMachine from "./hooks/useDCAuthMachine"
import useJoinModalMachine from "./hooks/useJoinModalMachine"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const JoinDiscordModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent[platform]
  const [authState, authSend] = useDCAuthMachine()
  const [joinState, joinSend] = useJoinModalMachine("DISCORD", false)

  useEffect(() => {
    if (["notification", "success"].includes(authState.value as string)) {
      joinState.context.id = authState.context.id
      joinSend("ENABLE")
    }
  }, [authState.value])

  const closeModal = () => {
    joinSend("CLOSE_MODAL")
    authSend("CLOSE_MODAL")
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
            error={joinState.context.error || authState.context.error}
            processError={processJoinPlatformError}
          />
          {joinState.value !== "success" ? (
            <Text>{description}</Text>
          ) : (
            /** Negative margin bottom to offset the Footer's padding that's there anyway */
            <VStack spacing="6" mb="-8">
              {joinState.context.inviteData.alreadyJoined ? (
                <Text>
                  Seems like you've already joined the Discord server, you should get
                  access to the correct channels soon!
                </Text>
              ) : (
                <>
                  <Text>Here’s your invite link:</Text>
                  <Link
                    href={joinState.context.inviteData.inviteLink}
                    colorScheme="blue"
                    isExternal
                  >
                    {joinState.context.inviteData.inviteLink}
                    <Icon as={ArrowSquareOut} mx="2" />
                  </Link>
                  <QRCode
                    size={150}
                    value={joinState.context.inviteData.inviteLink}
                  />
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <VStack spacing={2} alignItems="strech">
            <AuthButton state={authState.value as string} send={authSend} />
            {(() => {
              switch (joinState.value) {
                case "disabled":
                  return (
                    <ModalButton disabled colorScheme="gray">
                      Sign
                    </ModalButton>
                  )
                case "signing":
                  return <ModalButton isLoading loadingText="Waiting confirmation" />
                case "fetching":
                  return (
                    <ModalButton isLoading loadingText="Generating invite link" />
                  )
                case "success":
                  return null
                case "idle":
                case "error":
                default:
                  return (
                    <ModalButton
                      onClick={() => {
                        authSend("HIDE_NOTIFICATION")
                        joinSend("SIGN")
                      }}
                    >
                      Sign
                    </ModalButton>
                  )
              }
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
