import { ExternalProvider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import Wallets from "utils/wallets"

const useWalletType = () => {
  const { library } = useWeb3React<Web3Provider>()
  if ((library?.provider as ExternalProvider & { wc?: Record<string, unknown> })?.wc)
    return Wallets.WALLETCONNECT
  if (library?.provider.isMetaMask) return Wallets.METAMASK
  return undefined
}

export default useWalletType
