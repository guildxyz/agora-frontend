import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Text,
  Collapse,
  CloseButton,
  Box,
  Center,
} from "@chakra-ui/react"
import { Info, Check, ArrowCircleUp } from "phosphor-react"
import { useEffect } from "react"
import type { AccessRequirements } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"
import ModalButton from "components/common/ModalButton"
import { Error } from "components/common/Error"
import { useCommunity } from "components/community/Context"
import useStakingModalMachine from "./hooks/useStakingModalMachine"

type Props = {
  name: string
  accessRequirement: AccessRequirements
  isOpen: boolean
  onClose: () => void
}

const StakingModal = ({
  name,
  accessRequirement: { amount, timelockMs },
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const {
    chainData: {
      token: { symbol: tokenSymbol },
    },
  } = useCommunity()
  const [state, send] = useStakingModalMachine(amount)

  useEffect(() => {
    console.log({
      state: state.value,
      context: state.context,
    })
  }, [state])

  const closeModal = () => {
    send("RESET")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.value === "success"
            ? `Transaction submitted`
            : `Stake to join ${name}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {state.value === "success" ? (
            <>
              <Center>
                <ArrowCircleUp
                  size="50%"
                  color="var(--chakra-colors-primary-500)"
                  weight="thin"
                />
              </Center>
              <Text fontWeight="medium" mt="8" mb="4">
                Avarage transaction time is 2 minutes. You’ll be notified when it
                succeeds.
              </Text>
              <Text textColor="gray">
                You’ll recieve 0,5 yCakeAgoraToken in return. Those mark your
                position, so don’t sell or send them because you will lose access to
                the community level and won’t be able to get your yCake tokens back.
              </Text>
            </>
          ) : (
            <>
              <Error
                error={state.context.error}
                processError={() => ({
                  title: "Error",
                  description: "Error description",
                })}
              />
              <Text fontWeight="medium">
                Stake {amount} {tokenSymbol} to gain access to {name}. Your tokens
                will be locked for {msToReadableFormat(timelockMs)}, after that you
                can unstake them anytime. You can always stake more to upgrade to
                higher levels.
              </Text>
            </>
          )}
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
                      <Collapse in={state.context.showApproveSuccess}>
                        <ModalButton
                          colorScheme="gray"
                          onClick={() => send("HIDE_APPROVE_SUCCESS")}
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
                  return <ModalButton isLoading loadingText="Waiting confirmation" />
                case "stakingError":
                  return (
                    <ModalButton onClick={() => send("STAKE")}>
                      Confirm stake
                    </ModalButton>
                  )
                case "success":
                  return <ModalButton onClick={closeModal}>Close</ModalButton>
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
