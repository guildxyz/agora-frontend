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
import { useCommunity } from "components/community/Context"
import QRCode from "qrcode.react"
import platformsContent from "../../platformsContent"
import useJoinDiscordMachine from "./hooks/useJoinDiscordMachine"
import processJoinPlatformError from "./utils/processJoinPlatformError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const JoinDiscordModal = ({
  platform,
  isOpen,
  onClose,
  onOpen,
}: Props): JSX.Element => {
  const {
    title,
    join: { description },
  } = platformsContent[platform]
  const [state, send] = useJoinDiscordMachine(onOpen)
  const { urlName } = useCommunity()

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
              {state.context.inviteData.alreadyJoined ? (
                <Text>
                  Seems like you already joined the discord server, you should get
                  access to the correct channels soon!
                </Text>
              ) : (
                <>
                  <Text>
                    The generated link is only active for 15 minutes and is only
                    usable once.
                  </Text>
                  <QRCode size={150} value={state.context.inviteData.inviteLink} />
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {(() => {
            switch (state.value) {
              case "signing":
                return <ModalButton isLoading loadingText="Waiting confirmation" />
              case "registering":
                return (
                  <ModalButton
                    isLoading
                    loadingText="Conneting your Discord account"
                  />
                )
              case "fetchingUserData":
                return <ModalButton isLoading loadingText="Fetching Discord data" />
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
              case "signIdle":
              case "signError":
                return <ModalButton onClick={() => send("SIGN")}>Sign</ModalButton>
              default:
              case "idle":
              case "authError":
                return (
                  <Link
                    _hover={{ textDecoration: "none" }}
                    href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&response_type=token&scope=identify&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI}&state=${urlName}`}
                  >
                    <ModalButton>Authenticate</ModalButton>
                  </Link>
                )
            }
          })()}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JoinDiscordModal
