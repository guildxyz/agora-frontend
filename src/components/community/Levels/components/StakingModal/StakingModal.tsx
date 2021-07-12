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
} from "components/common/AllowanceModal"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import TransactionSubmitted from "components/common/TransactionSubmitted"
import { useCommunity } from "components/community/Context"
import type { AccessRequirement } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"
import { processMetaMaskError } from "utils/processMetaMaskError"
import useNeededAmount from "../../hooks/useNeededAmount"
import useStakingModalMachine from "./hooks/useStakingMachine"

type Props = {
  levelName: string
  accessRequirement: AccessRequirement
  isOpen: boolean
  onClose: () => void
}

const StakingModal = ({
  levelName,
  accessRequirement,
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const amount = useNeededAmount(accessRequirement)
  const [state, send] = useStakingModalMachine(amount)

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }

  const startStaking = () => {
    send("STAKE")
  }

  return (
    <AllowanceModal token={token} isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {state.value === "success"
            ? `Transaction submitted`
            : `Stake to join ${levelName}`}
        </ModalHeader>
        <ModalCloseButton />
        <AllowanceModalBody>
          {state.value === "success" ? (
            <>
              <TransactionSubmitted transaction={state.context.transaction} />
              <Text textColor="gray" mt="4">
                You’ll recieve {amount} {stakeToken.symbol} in return. Those mark
                your position, so don’t sell or send them because you will lose
                access to the community level and won’t be able to get your{" "}
                {token.symbol} tokens back.
              </Text>
            </>
          ) : (
            <>
              <Error
                error={state.context.error}
                processError={processMetaMaskError}
              />
              <Text fontWeight="medium">
                Stake {amount} {token.symbol} to gain access to {levelName}. Your
                tokens will be locked for{" "}
                {msToReadableFormat(accessRequirement.timelockMs)}, after that you
                can unstake them anytime. You can always stake more to upgrade to
                higher levels.
              </Text>
            </>
          )}
        </AllowanceModalBody>
        <AllowanceModalFooter
          successText={`You can now stake ${token.symbol}`}
          disabledText="Confirm stake"
        >
          {(hideNotification: () => void) => {
            switch (state.value) {
              case "idle":
              case "error":
              default:
                return (
                  <ModalButton
                    onClick={() => {
                      startStaking()
                      hideNotification()
                    }}
                  >
                    Confirm stake
                  </ModalButton>
                )
              case "waitingConfirmation":
                return <ModalButton isLoading loadingText="Waiting confirmation" />
              case "success":
                return <ModalButton onClick={closeModal}>Close</ModalButton>
            }
          }}
        </AllowanceModalFooter>
      </ModalContent>
    </AllowanceModal>
  )
}

export default StakingModal
