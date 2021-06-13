import {
  Button,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react"
import usePersonalSign from "hooks/usePersonalSign"
import { Link } from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import { useState } from "react"
import type { State, JoinOrLeavePlatformProps as Props } from "../types"
import SignError from "./SignError"

const JoinPlatform = ({
  platform,
  communityType,
  communityId,
}: Props): JSX.Element => {
  const [modalState, setModalState] = useState<State>("initial")
  const sign = usePersonalSign()
  return (
    <>
      <ModalHeader>{`Join ${
        platform.charAt(0).toUpperCase() + platform.slice(1)
      } ${communityType}`}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SignError error={typeof modalState === "string" ? null : modalState} />
        {modalState !== "success" && (
          <Text>
            To generate your invite link, first you have to sign a message with your
            wallet.
          </Text>
        )}
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
            colorScheme="blue"
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
    </>
  )
}

export default JoinPlatform
