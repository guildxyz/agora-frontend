import { CloseButton, Collapse, Text } from "@chakra-ui/react"
import ModalButton from "components/common/ModalButton"
import { Check } from "phosphor-react"
import React from "react"
import { State } from "xstate"
import type { ContextType } from "../hooks/useDCAuthMachine"

type Props = {
  state: string
  send: (event: string) => State<ContextType>
}

const AuthButton = ({ state, send }: Props) => {
  switch (state) {
    case "success":
    case "notification":
      return (
        <Collapse in={state === "notification"} unmountOnExit>
          <ModalButton
            as="div"
            colorScheme="gray"
            variant="solidStatic"
            rightIcon={<CloseButton onClick={() => send("HIDE_NOTIFICATION")} />}
            leftIcon={<Check />}
            justifyContent="space-between"
            px="4"
          >
            <Text title="Authentication successful" isTruncated>
              Authentication successful
            </Text>
          </ModalButton>
        </Collapse>
      )
    case "authenticating":
      return <ModalButton isLoading loadingText="Waiting for authentication" />
    case "idle":
    case "error":
    default:
      return <ModalButton onClick={() => send("AUTH")}>Connect Discord</ModalButton>
  }
}

export default AuthButton
