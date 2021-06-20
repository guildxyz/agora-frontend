import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Collapse,
  CloseButton,
  Box,
} from "@chakra-ui/react"
import { Info, Check } from "phosphor-react"
import { useEffect } from "react"
import type { AccessRequirements } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"
import ModalButton from "components/common/ModalButton"
import { Error } from "components/common/Error"
import useStakingModalMachine from "./hooks/useStakingModalMachine"

type Props = {
  name: string
  tokenSymbol: string
  isOpen: boolean
  onClose: () => void
  accessRequirement: AccessRequirements
}

const StakingModal = ({
  name,
  tokenSymbol,
  isOpen,
  onClose,
  accessRequirement: { amount, timelockMs },
}: Props): JSX.Element => {
  const [state, send] = useStakingModalMachine()

  useEffect(() => {
    console.log({
      state: state.value,
      context: state.context,
    })
  }, [state])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Stake to join {name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={() => ({
              title: "Error",
              description: "Error description",
            })}
          />
          Stake {amount} {tokenSymbol} to gain access to {name}. Your tokens will be
          locked for {msToReadableFormat(timelockMs)}, after that you can unstake
          them anytime. You can always stake more to upgrade to higher levels.
        </ModalBody>
        <ModalFooter>
          <VStack spacing={3}>
            {(() => {
              switch (state.value) {
                case "initial":
                  return (
                    <ModalButton isLoading loadingText="Checking transactions" />
                  )
                case "noPermission":
                case "approveTransactionError":
                  return (
                    <ModalButton rightIcon={<Info />} onClick={() => send("ALLOW")}>
                      {`Allow Agora to use ${tokenSymbol}`}
                    </ModalButton>
                  )
                case "approving":
                  return <ModalButton isLoading loadingText="Waiting confirmation" />
                case "approveTransactionPending":
                  return (
                    <ModalButton
                      isLoading
                      loadingText="Waiting for transaction to succeed"
                    />
                  )
                case "idle":
                case "staking":
                case "stakingError":
                  return (
                    <Box w="100%">
                      <Collapse in={!state.context.confirmationDismissed}>
                        <ModalButton
                          colorScheme="gray"
                          onClick={() => send("DISMISS_CONFIRMATION")}
                          rightIcon={<CloseButton />}
                          leftIcon={<Check />}
                          justifyContent="space-between"
                          fontSize="1em"
                        >
                          {`You can now stake ${tokenSymbol}`}
                        </ModalButton>
                      </Collapse>
                    </Box>
                  )
                default:
                  return null
              }
            })()}
            {(() => {
              switch (state.value) {
                case "idle":
                  return (
                    <ModalButton onClick={() => send("STAKE")}>
                      Confirm stake
                    </ModalButton>
                  )
                case "staking":
                  return (
                    <ModalButton
                      isLoading
                      loadingText="Staking process in progress"
                    />
                  )
                case "stakingError":
                  return (
                    <ModalButton onClick={() => send("STAKE")}>
                      Confirm stake
                    </ModalButton>
                  )
                default:
                  return (
                    <ModalButton disabled colorScheme="gray">
                      Confirm stake
                    </ModalButton>
                  )
              }
            })()}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
