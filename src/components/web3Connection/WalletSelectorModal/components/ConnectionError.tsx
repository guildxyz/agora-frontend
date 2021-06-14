import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector"
import Error from "components/common/Error"

const ConnectionError = (): JSX.Element => {
  const { error } = useWeb3React()

  return <Error error={error} processError={processError} />
}

export default ConnectionError

function processError(error: Error) {
  switch (error.constructor) {
    case NoEthereumProviderError:
      return {
        title: "Wallet not found",
        description:
          "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.",
      }
    case UnsupportedChainIdError:
      return {
        title: "Wrong network",
        description:
          "Please switch to the appropriate Ropsten network, or connect to another wallet.",
      }
    case UserRejectedRequestError:
      return {
        title: "Error connecting. Try again!",
        description:
          "Please authorize this website to access your Ethereum account.",
      }
    default:
      console.error(error)
      return {
        title: "An unknown error occurred",
        description: "Check the console for more details.",
      }
  }
}
