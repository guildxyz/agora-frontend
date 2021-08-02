import { BigNumber } from "@ethersproject/bignumber"
import { ExternalProvider } from "@ethersproject/providers"
import { useCommunity } from "components/community/Context"
import { Chains, RPC } from "connectors"

const useRequestNetworkChange = () => {
  const communityData = useCommunity()

  // If we are on the all communities page, we don't have a chainData from communityData, setting Polygon as a default there
  const chainName = communityData?.chainData.name ?? "polygon"

  const chainId = BigNumber.from(Chains[chainName]).toHexString()

  const requestNetworkChange = async () => {
    const { ethereum } = window as Window &
      typeof globalThis & { ethereum: ExternalProvider }

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
    } catch (e) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (e.code === 4902) {
        try {
          if (!RPC[chainName]) throw Error()

          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [RPC[chainName]],
          })
        } catch (addError) {
          console.error("Failed to add network to MetaMask")
        }
      }
      // handle other "switch" errors
    }
  }

  return requestNetworkChange
}

export default useRequestNetworkChange
