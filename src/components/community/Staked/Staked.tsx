import { Button, Box, Tooltip, useDisclosure } from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import msToReadableFormat from "utils/msToReadableFormat"
import useUnstake from "./components/UnstakingModal/hooks/useUnstake"
import UnstakingModal from "./components/UnstakingModal/UnstakingModal"
import useHasStaked from "./hooks/useHasStaked"

const Staked = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const hasStaked = useHasStaked()
  const { canUnstake, expirity } = useUnstake()

  return (
    hasStaked && (
      <ActionCard title="Staked" description="TODO">
        <Tooltip
          isDisabled={canUnstake}
          label={`You can't unstake yet, your timelock expires in ${msToReadableFormat(
            expirity
          )}`}
        >
          <Box>
            <Button
              disabled={!canUnstake}
              colorScheme="primary"
              fontWeight="medium"
              onClick={onOpen}
            >
              Unstake
            </Button>
          </Box>
        </Tooltip>
        <UnstakingModal isOpen={isOpen} onClose={onClose} />
      </ActionCard>
    )
  )
}

export default Staked
