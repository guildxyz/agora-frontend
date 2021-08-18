import { InjectedConnector } from "@web3-react/injected-connector"

enum Chains {
  ETHEREUM = 1,
  ROPSTEN = 3,
  GOERLI = 5,
  BSC = 56,
  BSCTEST = 97,
  POLYGON = 137,
}

enum SpaceFactory {
  BSCTEST = "0xf7D32e49C09F88Fa779aC12a951f9C3aF2b08869",
}

const RPC = {
  POLYGON: {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    iconUrls: ["/networkLogos/polygon.svg"],
  },
  ETHEREUM: {
    chainName: "Ethereum",
    blockExplorerUrls: ["https://etherscan.io/"],
    iconUrls: ["/networkLogos/ethereum.svg"],
  },
  GOERLI: {
    chainName: "Goerli",
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    iconUrls: ["/networkLogos/ethereum.svg"],
  },
  BSC: {
    chainId: "0x38",
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
    iconUrls: ["/networkLogos/bsc.svg"],
  },
  BSCTEST: {
    chainId: "0x61",
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    iconUrls: ["/networkLogos/bsc.svg"],
  },
}

const supportedChains = ["POLYGON", "BSC", "BSCTEST", "GOERLI", "ETHEREUM"]
const supportedChainIds = supportedChains.map((_) => Chains[_])

const injected = new InjectedConnector({ supportedChainIds })

export { Chains, SpaceFactory, RPC, supportedChains }
export default injected
