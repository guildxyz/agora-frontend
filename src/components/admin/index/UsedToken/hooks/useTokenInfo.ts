import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { RPC } from "connectors"
import ERC_20_ABI from "constants/erc20abi.json"
import { useMemo } from "react"
import useSWR from "swr"

type TokenInfo = {
  name: string
  symbol: string
  decimals: number
}

const getTokenInfo = async (_: string, contract: Contract): Promise<TokenInfo> => {
  const info = await Promise.all<string>([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
  ]).catch((e) => {
    console.error(e)
    throw e
  })
  return {
    name: info[0],
    symbol: info[1],
    decimals: +info[2],
  }
}

const useTokenInfo = (address: string, selectedChain: string) => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && selectedChain.length

  const contract = useMemo(
    () =>
      shouldFetch
        ? new Contract(
            address,
            ERC_20_ABI,
            new JsonRpcProvider(RPC[selectedChain].rpcUrls[0])
          )
        : null,
    [shouldFetch, address, selectedChain]
  )

  const {
    data: tokenInfo,
    isValidating,
    error,
  } = useSWR<TokenInfo>(
    shouldFetch ? [`${address}_info`, contract, address] : null,
    getTokenInfo
  )

  return { tokenInfo, isValidating, error }
}

export default useTokenInfo
