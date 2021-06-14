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
  HStack,
  Image,
} from "@chakra-ui/react"
import { CommunityContext } from "components/community/Context"
import { Link } from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import { useContext, useState } from "react"
import type { SignErrorType } from "../hooks/usePersonalSign"
import { usePersonalSign } from "../hooks/usePersonalSign"
import SignError from "./SignError"
import platformsData from "../platformsData"

type State = "initial" | "loading" | "success" | SignErrorType
type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const JoinModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const { id: communityId } = useContext(CommunityContext)
  const [modalState, setModalState] = useState<State>("initial")
  const sign = usePersonalSign()
  const {
    join: { title, description },
  } = platformsData[platform]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SignError error={typeof modalState === "string" ? null : modalState} />
          {modalState !== "success" && <Text>{description}</Text>}
          {modalState === "success" && (
            <VStack spacing="6">
              <Text>
                Here’s your link. It’s only active for 10 minutes and is only usable
                once:
              </Text>
              <Link href="https://discord.gg/tfg3GYgu" color="#006BFF">
                <HStack>
                  <Text>https://discord.gg/tfg3GYgu</Text>
                  <ArrowSquareOut size="1.3em" weight="light" color="#006BFF" />
                </HStack>
              </Link>
              <Image src="./temp/qr.svg" alt="Discord invite QR" />
            </VStack>
          )}
        </ModalBody>
        {modalState !== "success" && (
          <ModalFooter>
            <Button
              isLoading={modalState === "loading"}
              loadingText="Waiting confirmation"
              w="100%"
              colorScheme="primary"
              size="lg"
              onClick={() => {
                setModalState("loading")
                sign("Please sign this message to generate your invite link")
                  .then((message) => {
                    // eslint-disable-next-line no-console
                    console.log({ message, platform, communityId })
                    setModalState("success")
                  })
                  .catch((e) => {
                    setModalState(e)
                  })
              }}
            >
              Sign
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default JoinModal
