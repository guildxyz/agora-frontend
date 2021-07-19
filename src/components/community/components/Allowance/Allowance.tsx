import { CloseButton, Collapse, Icon, Tooltip } from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import { useCommunity } from "components/community/Context"
import { Check, Info } from "phosphor-react"

const Allowance = ({ state, send, successText }) => {
  const {
    chainData: { token },
  } = useCommunity()

  switch (state.value) {
    case "noAllowance":
    case "error":
      return (
        <ModalButton
          mb="3"
          rightIcon={
            <Tooltip
              label={`You have to give the Agora smart contracts permission to use your ${token.symbol}. You only have to do this once per token.`}
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
          {`Allow Agora to use ${token.symbol}`}
        </ModalButton>
      )
    case "waitingConfirmation":
      return <ModalButton mb="3" isLoading loadingText="Waiting confirmation" />
    case "waitingForTransaction":
      return (
        <ModalButton
          mb="3"
          isLoading
          loadingText="Waiting for transaction to succeed"
        />
      )
    case "successNotification":
    case "allowanceGranted":
    default:
      return (
        <Collapse in={state.value === "successNotification"} unmountOnExit>
          <ModalButton
            as="div"
            colorScheme="gray"
            variant="solidStatic"
            rightIcon={<CloseButton onClick={() => send("HIDE_NOTIFICATION")} />}
            leftIcon={<Check />}
            justifyContent="space-between"
            mb="3"
          >
            {successText}
          </ModalButton>
        </Collapse>
      )
  }
}

export default Allowance
