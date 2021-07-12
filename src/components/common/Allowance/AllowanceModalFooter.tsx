import {
  CloseButton,
  Collapse,
  Icon,
  ModalFooter,
  Tooltip,
  VStack,
} from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import { Check, Info } from "phosphor-react"
import { useAllowance } from "./hooks/useAllowance"

const Footer = ({ children, disabledText, successText }) => {
  const { state, send, token } = useAllowance()
  return (
    <ModalFooter>
      <VStack spacing="0" alignItems="strech">
        {/* margin is applied on the approve button,
            so there's no unwanted space when it's not shown */}
        {(() => {
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
              return (
                <ModalButton mb="3" isLoading loadingText="Waiting confirmation" />
              )
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
                    rightIcon={
                      <CloseButton onClick={() => send("HIDE_NOTIFICATION")} />
                    }
                    leftIcon={<Check />}
                    justifyContent="space-between"
                    mb="3"
                  >
                    {successText}
                  </ModalButton>
                </Collapse>
              )
          }
        })()}

        {["allowanceGranted", "successNotification"].includes(state.value) ? (
          children(() => send("HIDE_NOTIFICATION"))
        ) : (
          <ModalButton
            disabled
            colorScheme="gray"
            bg="gray.200"
            _hover={{ bg: "gray.200" }}
          >
            {disabledText}
          </ModalButton>
        )}
      </VStack>
    </ModalFooter>
  )
}

export default Footer
