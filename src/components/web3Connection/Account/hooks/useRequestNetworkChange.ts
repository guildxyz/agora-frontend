import { BigNumber } from "@ethersproject/bignumber"
import { ExternalProvider } from "@ethersproject/providers"
import { useCommunity } from "components/community/Context"
import { addToWalletData, Chains } from "connectors"

const useRequestNetworkChange = () => {
  const communityData = useCommunity()

  const requestNetworkChange = async () => {
    const { ethereum } = window as Window &
      typeof globalThis & { ethereum: ExternalProvider }

    // If we are on the all communities page, we don't have a chainData from communityData, setting Polygon as a default there
    const chainName = communityData?.chainData.name ?? "polygon"

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: BigNumber.from(Chains[chainName]).toHexString(),
          },
        ],
      })
    } catch (e) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (e.code === 4902) {
        try {
          if (!addToWalletData[chainName]) throw Error()

          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [addToWalletData[chainName]],
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
