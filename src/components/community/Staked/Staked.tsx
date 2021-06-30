import { Button, useDisclosure } from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import UnstakingModal from "./components/UnstakingModal/UnstakingModal"

const Staked = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ActionCard title="Staked" description="TODO">
      <Button colorScheme="primary" fontWeight="medium" onClick={onOpen}>
        Unstake
      </Button>
      <UnstakingModal isOpen={isOpen} onClose={onClose} />
    </ActionCard>
  )
}

export default Staked
