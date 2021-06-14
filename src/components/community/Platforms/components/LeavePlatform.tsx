import {
  Button,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import type { JoinOrLeavePlatformProps as Props } from "../types"

const LeavePlatform = ({
  platform,
  communityId,
  title,
  description,
  buttonText,
}: Props): JSX.Element => {
  const { account } = useWeb3React()

  return (
    <>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>{description}</Text>
      </ModalBody>
      <ModalFooter>
        <Button
          w="100%"
          colorScheme="blue"
          size="lg"
          // eslint-disable-next-line no-console
          onClick={() => console.log({ address: account, platform, communityId })}
        >
          {buttonText}
        </Button>
      </ModalFooter>
    </>
  )
}

export default LeavePlatform
