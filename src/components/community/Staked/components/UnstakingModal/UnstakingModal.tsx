import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Center,
  VStack,
  Tooltip,
  Icon,
  Collapse,
  CloseButton,
} from "@chakra-ui/react"
import { ArrowCircleUp, Info, Check } from "phosphor-react"
import { Error } from "components/common/Error"
import { useCommunity } from "components/community/Context"
import ModalButton from "components/common/ModalButton"
import useTokenAllowanceMachine from "components/community/hooks/useTokenAllowanceMachine"
import useUnstakingModalMachine from "./hooks/useUnstakingModalMachine"
import processUnstakingError from "./utils/processUnstakingError"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const UnstakingModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const {
    chainData: { stakeToken },
  } = useCommunity()
  const tokenSymbol = stakeToken.symbol
  const [allowanceState, allowanceSend] = useTokenAllowanceMachine(stakeToken)
  const [unstakeState, unstakeSend] = useUnstakingModalMachine()

  const closeModal = () => {
    allowanceSend("RESET")
    unstakeSend("RESET")
    onClose()
  }

  const startUnstaking = () => {
    allowanceSend("HIDE_NOTIFICATION")
    unstakeSend("UNSTAKE")
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {unstakeState.value === "success"
            ? "Transaction submitted"
            : "Unstake tokens"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {unstakeState.value === "success" ? (
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
            </>
          ) : (
            <>
              <Error
                error={unstakeState.context.error || allowanceState.context.error}
                processError={processUnstakingError}
              />
              <Text>
                By unstaking you’ll lose access to the relevant levels. You can
                always stake back, but then the timelock will restart.
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <VStack spacing="0" alignItems="strech">
            {(() => {
              switch (allowanceState.value) {
                case "idle":
                case "error":
                  return (
                    <ModalButton
                      mb="3"
                      rightIcon={
                        <Tooltip
                          label={`You have to give the Agora smart contracts permission to use your ${tokenSymbol}. You only have to do this once per token.`}
                          placement="top"
                        >
                          <Icon as={Info} tabIndex={0} />
                        </Tooltip>
                      }
                      // so the button label will be positioned to the center
                      leftIcon={<span />}
                      justifyContent="space-between"
                      onClick={() => allowanceSend("ALLOW")}
                    >
                      {`Allow Agora to use ${tokenSymbol}`}
                    </ModalButton>
                  )
                case "waitingConfirmation":
                  return (
                    <ModalButton
                      mb="3"
                      isLoading
                      loadingText="Waiting confirmation"
                    />
                  )
                case "waitingForTransaction":
                  return (
                    <ModalButton
                      mb="3"
                      isLoading
                      loadingText="Waiting for transaction to succeed"
                    />
                  )

                case "success":
                case "successNotification":
                default:
                  return (
                    <Collapse
                      in={allowanceState.value === "successNotification"}
                      unmountOnExit
                    >
                      <ModalButton
                        as="div"
                        colorScheme="gray"
                        variant="solidStatic"
                        rightIcon={
                          <CloseButton
                            onClick={() => allowanceSend("HIDE_NOTIFICATION")}
                          />
                        }
                        leftIcon={<Check />}
                        justifyContent="space-between"
                        mb="3"
                      >
                        {`You can now unstake ${tokenSymbol}`}
                      </ModalButton>
                    </Collapse>
                  )
              }
            })()}

            {["success", "successNotification"].includes(allowanceState.value) ? (
              (() => {
                // We only have one tag per state, I don't see a reason why we would have more in the future
                switch (unstakeState.value) {
                  case "idle":
                  case "error":
                  default:
                    return (
                      <ModalButton onClick={startUnstaking}>
                        Confirm unstake
                      </ModalButton>
                    )
                  case "loading":
                    return (
                      <ModalButton isLoading loadingText="Waiting confirmation" />
                    )
                  case "success":
                    return <ModalButton onClick={closeModal}>Close</ModalButton>
                }
              })()
            ) : (
              <ModalButton
                disabled
                colorScheme="gray"
                bg="gray.200"
                _hover={{ bg: "gray.200" }}
              >
                Confirm unstake
              </ModalButton>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default UnstakingModal
