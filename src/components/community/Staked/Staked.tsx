import {
  Button,
  Box,
  Tooltip,
  useDisclosure,
  ScaleFade,
  chakra,
} from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import msToReadableFormat from "utils/msToReadableFormat"
import { useCommunity } from "../Context"
import UnstakingModal from "./components/UnstakingModal/UnstakingModal"
import useStaked from "./hooks/useStaked"
import formatDate from "./utils/formatDate"

const Staked = (): JSX.Element => {
  const {
    chainData: {
      stakeToken: { symbol: stakeTokenSymbol },
    },
  } = useCommunity()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { unlocked, locked } = useStaked()

  return (
    <ScaleFade in={!!unlocked || !!locked.length} initialScale={0.9} unmountOnExit>
      <ActionCard
        title="Staked"
        description={[
          !!unlocked && (
            <chakra.span display="block" key="unlocked">
              {unlocked} {stakeTokenSymbol} - unlocked
            </chakra.span>
          ),
          ...locked.map(({ amount, expires }) => (
            <chakra.span display="block" key={+expires}>
              {amount} {stakeTokenSymbol} - locked until {formatDate(expires)}
            </chakra.span>
          )),
        ]}
      >
        <Tooltip
          isDisabled={!!unlocked}
          label={`You can't unstake yet, your next timelock expires in ${msToReadableFormat(
            Math.min(...locked.map(({ expires }) => +expires)) - Date.now()
          )}`}
        >
          <Box>
            <Button
              disabled={!unlocked}
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
    </ScaleFade>
  )
}

export default Staked
