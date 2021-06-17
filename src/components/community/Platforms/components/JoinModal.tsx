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
import { Link } from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import QRCode from "qrcode.react"
import { Error } from "components/common/Error"
import { useCommunity } from "components/community/Context"
import useJoinModalMachine from "../hooks/useJoinModalMachine"
import { usePersonalSign } from "../hooks/usePersonalSign"
import platformsContent from "../platformsContent"
import processSignError from "../utils/processSignError"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}
type InviteData = {
  link: string
  code?: number
}

// ! This is a dummy function for the demo !
const getInviteLink = (
  platform: string,
  communityId: number,
  message: string
): InviteData => {
  // eslint-disable-next-line no-console
  console.log({ platform, communityId, message })
  return {
    link: "https://discord.gg/tfg3GYgu",
    code: 1235,
  }
}

const JoinModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const { id: communityId } = useCommunity()
  const sign = usePersonalSign()
  const {
    join: { title, description },
  } = platformsContent[platform]
  const [state, send] = useJoinModalMachine()

  const handleSign = () => {
    send("signInProgress")
    sign("Please sign this message to generate your invite link")
      .then((message) => {
        send({
          type: "signSuccessful",
          inviteData: getInviteLink(platform, communityId, message),
        })
      })
      .catch((error) => {
        send({
          type: "signFailed",
          error,
        })
      })
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
          <Error error={state.context.error} processError={processSignError} />
          {state.value !== "success" ? (
            <Text>{description}</Text>
          ) : (
            <VStack spacing="6">
              <Text>
                Here’s your link. It’s only active for 10 minutes and is only usable
                once:
              </Text>
              <Link
                href={state.context.inviteData.link}
                color="#006BFF"
                display="flex"
                isExternal
              >
                {state.context.inviteData.link}
                <ArrowSquareOut size="1.3em" weight="light" color="#006BFF" />
              </Link>
              <QRCode size={150} value={state.context.inviteData.link} />
              {!!state.context.inviteData.code && (
                <>
                  <Text>
                    If there’s lot of traffic right now, the bot might ask you for a
                    join code immediately after you land in the server. It’s usually
                    not the case, but if it is, here’s what you need:
                  </Text>
                  <Text fontWeight="700" fontSize="2xl" letterSpacing="5px">
                    {state.context.inviteData.code}
                  </Text>
                </>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          {state.value !== "success" ? (
            <Button
              isLoading={state.value === "loading"}
              loadingText="Waiting confirmation"
              w="100%"
              colorScheme="primary"
              size="lg"
              onClick={handleSign}
            >
              Sign
            </Button>
          ) : (
            <Button w="100%" colorScheme="primary" size="lg" onClick={onClose}>
              Done
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { JoinModal }
export type { InviteData }
