import { Button } from "@chakra-ui/react"
import useFactoryMachine from "components/[community]/hooks/useFactoryMachine"
import { CheckCircle } from "phosphor-react"

const DeploySpace = () => {
  const [state, send] = useFactoryMachine()

  switch (state.value) {
    case "idle":
    case "error":
      return (
        <Button
          variant="solid"
          colorScheme="primary"
          size="md"
          onClick={() => send("DEPLOY")}
        >
          Deploy contract
        </Button>
      )
    case "success":
      return (
        <Button
          isDisabled
          variant="outline"
          colorScheme="primary"
          size="md"
          rightIcon={<CheckCircle />}
        >
          Deployed
        </Button>
      )
    default:
      return (
        <Button isLoading variant="solid" colorScheme="primary" size="md">
          Deploying
        </Button>
      )
  }
}

export default DeploySpace
