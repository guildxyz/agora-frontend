/* eslint-disable no-bitwise */
import { aggregate } from "@makerdao/multicall"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import useSWR from "swr"
import { RequirementType, Token } from "temporaryData/types"
import MulticallAddresses from "utils/multicall"
import useBalance from "./useBalance"

const getMutagenNfts = async (
  _: string,
  amount: number,
  mutagenAddress: string,
  account: string,
  currentChain: string
) => {
  const requests = [...Array(amount)].map((_, i) => ({
    target: mutagenAddress,
    call: ["tokenOfOwnerByIndex(address,uint256)(uint256)", account, i],
    returns: [[i, (val) => parseInt(val)]],
  }))

  const config = {
    multicallAddress: MulticallAddresses[currentChain],
    rpcUrl: RPC[currentChain].rpcUrls[0],
  }

  const {
    results: { transformed },
  } = await aggregate(requests, config)
  const ids: number[] = Object.values(transformed)

  return ids.map((tokenId) => {
    const type = tokenId & 3
    // source: https://etherscan.io/address/0xdf9e0684f15e60cfcc646acffb02d97d2d5a1a67#code#F3#L81
    const genesisIndex = (tokenId >> 2) & 63

    if (type === 0) return `Genesis_${genesisIndex}`
    if (type === 1) return `Print_${genesisIndex}`
    return null
  })
}

const useMutagenNfts = (requirementType: RequirementType, token: Token) => {
  const { account, chainId } = useWeb3React()
  const amount = useBalance(token)

  const shouldFetch =
    requirementType === "NFT_HOLD" &&
    !!token &&
    amount > 0 &&
    typeof chainId === "number"

  const { data } = useSWR(
    shouldFetch
      ? ["mutagen", amount, token.address, account, Chains[chainId]]
      : null,
    getMutagenNfts,
    /**
     * Can't use useKeepSWRDataLiveAsBlocksArrive because deduping doesn't work with
     * mutate and this way it triggers too many fetches here
     */
    { refreshInterval: 10000 }
  )

  return data
}

export default useMutagenNfts
