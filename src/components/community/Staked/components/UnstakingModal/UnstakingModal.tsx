import {
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import {
  AllowanceModal,
  AllowanceModalBody,
  AllowanceModalFooter,
} from "components/common/Allowance"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import TransactionSubmitted from "components/common/TransactionSubmitted"
import { useCommunity } from "components/community/Context"
import useUnstakingModalMachine from "./hooks/useUnstakingMachine"
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
  const [state, send] = useUnstakingModalMachine()

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  const startUnstaking = () => {
    send("UNSTAKE")
  }

  return (
    <AllowanceModal token={stakeToken} isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.value === "success" ? "Transaction submitted" : "Unstake tokens"}
        </ModalHeader>
        <ModalCloseButton />
        <AllowanceModalBody>
          {state.value === "success" ? (
            <TransactionSubmitted transaction={state.context.transaction} />
          ) : (
            <>
              <Error
                error={state.context.error}
                processError={processUnstakingError}
              />
              <Text>
                By unstaking you’ll lose access to the relevant levels. You can
                always stake back, but then the timelock will restart.
              </Text>
            </>
          )}
        </AllowanceModalBody>
        <AllowanceModalFooter
          successText={`You can now unstake ${tokenSymbol}`}
          disabledText="Confirm unstake"
          childState={state.value}
        >
          {(() => {
            switch (state.value) {
              case "idle":
              case "error":
              default:
                return (
                  <ModalButton onClick={startUnstaking}>Confirm unstake</ModalButton>
                )
              case "waitingConfirmation":
                return <ModalButton isLoading loadingText="Waiting confirmation" />
              case "success":
                return <ModalButton onClick={closeModal}>Close</ModalButton>
            }
          })()}
        </AllowanceModalFooter>
      </ModalContent>
    </AllowanceModal>
  )
}

export default UnstakingModal
