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
  communityType,
  communityId,
}: Props): JSX.Element => {
  const { account } = useWeb3React()

  return (
    <>
      <ModalHeader>{`Leave ${
        platform.charAt(0).toUpperCase() + platform.slice(1)
      } ${communityType}`}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button
          w="100%"
          colorScheme="blue"
          size="lg"
          // eslint-disable-next-line no-console
          onClick={() => console.log({ address: account, platform, communityId })}
        >
          Leave group
        </Button>
      </ModalFooter>
    </>
  )
}

export default LeavePlatform
