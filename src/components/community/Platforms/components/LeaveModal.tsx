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
} from "@chakra-ui/react"
import { useContext } from "react"
import { CommunityContext } from "components/community/Context"
import { useWeb3React } from "@web3-react/core"
import platformsData from "../platformsData"

type Props = {
  platform: string
  isOpen: boolean
  onClose: () => void
}

const LeaveModal = ({ platform, isOpen, onClose }: Props): JSX.Element => {
  const { id: communityId } = useContext(CommunityContext)
  const { account } = useWeb3React()
  const {
    leave: { title, description, buttonText },
  } = platformsData[platform]

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{description}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            w="100%"
            colorScheme="primary"
            size="lg"
            // eslint-disable-next-line no-console
            onClick={() => console.log({ address: account, platform, communityId })}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
