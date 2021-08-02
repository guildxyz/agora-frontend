import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ethereum = 1,
  ropsten = 3,
  bsc = 56,
  bsctest = 97,
  polygon = 137,
}

const RPC = {
  polygon: {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    // iconUrls: string[] // Currently ignored.
  },
  ethereum: {
    chainId: "0x01",
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [],
    blockExplorerUrls: [],
    // iconUrls: string[] // Currently ignored.
  },
  bsc: {
    chainId: "0x38",
    chainName: "BSC Mainnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
    // iconUrls: string[] // Currently ignored.
  },
}

const supportedChains = ["polygon", "bsc", "ethereum"]
const supportedChainIds = supportedChains.map((_) => Chains[_])

const injected = new InjectedConnector({ supportedChainIds })

export { Chains, RPC, supportedChains }
export default injected
