import { ModalBody } from "@chakra-ui/react"
import { Error } from "components/common/Error"
import { processMetaMaskError } from "utils/processMetaMaskError"
import { useAllowance } from "./Context"

const Body = ({ children }) => {
  const { state } = useAllowance()

  return (
    <ModalBody>
      <Error processError={processMetaMaskError} error={state.context.error} />
      {children}
    </ModalBody>
  )
}
export default Body
