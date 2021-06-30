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
import useUnstakingModalMachine from "./hooks/useUnstakingModalMachine"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const UnstakingModal = ({ isOpen, onClose }: Props): JSX.Element => {
  const [state, send] = useUnstakingModalMachine()
  const {
    chainData: {
      token: { symbol: tokenSymbol },
    },
  } = useCommunity()

  const closeModal = () => {
    send("RESET")
    onClose()
  }
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.value === "success" ? "Transaction submitted" : "Unstake tokens"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {state.hasTag("success") ? (
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
                error={state.context.error}
                processError={() => ({
                  title: "TODO",
                  description: "TODO",
                })}
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
            {Object.keys(state.value)[0] === "allowance" &&
              (() => {
                // We only have one tag per state, I don't see a reason why we would have more in the future
                switch ([...state.tags][0]) {
                  case "idle":
                    return (
                      <ModalButton
                        mb="3"
                        rightIcon={
                          <Tooltip
                            label="You have to give the Agora smart contracts permission to use your [token name]. You only have to do this once per token."
                            placement="top"
                          >
                            <Icon as={Info} tabIndex={0} />
                          </Tooltip>
                        }
                        // so the button label will be positioned to the center
                        leftIcon={<span />}
                        justifyContent="space-between"
                        onClick={() => send("ALLOW")}
                      >
                        {`Allow Agora to use ${tokenSymbol}`}
                      </ModalButton>
                    )
                  case "loading":
                    return (
                      <ModalButton
                        mb="3"
                        isLoading
                        loadingText={
                          state.meta[
                            `root.${state.toStrings()[state.toStrings().length - 1]}`
                          ].loadingText
                        }
                      />
                    )
                  default:
                    return null
                }
              })()}

            <Collapse in={state.context.showApproveSuccess}>
              <ModalButton
                as="div"
                colorScheme="gray"
                variant="solidStatic"
                rightIcon={
                  <CloseButton onClick={() => send("HIDE_APPROVE_SUCCESS")} />
                }
                leftIcon={<Check />}
                justifyContent="space-between"
                mb="3"
              >
                {`You can now unstake ${tokenSymbol}`}
              </ModalButton>
            </Collapse>

            {Object.keys(state.value)[0] === "unstake" &&
              (() => {
                // We only have one tag per state, I don't see a reason why we would have more in the future
                switch ([...state.tags][0]) {
                  case "idle":
                    return (
                      <ModalButton onClick={() => send("UNSTAKE")}>
                        Confirm unstake
                      </ModalButton>
                    )
                  case "loading":
                    return (
                      <ModalButton
                        isLoading
                        loadingText={
                          state.meta[
                            `root.${state.toStrings()[state.toStrings().length - 1]}`
                          ].loadingText
                        }
                      />
                    )
                  case "success":
                    return <ModalButton onClick={closeModal}>Close</ModalButton>
                  default:
                    return (
                      <ModalButton
                        disabled
                        colorScheme="gray"
                        bg="gray.200"
                        _hover={{ bg: "gray.200" }}
                      >
                        Confirm unstake
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

export default UnstakingModal
