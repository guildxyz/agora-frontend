import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { RPC } from "connectors"
import ERC_20_ABI from "constants/erc20abi.json"
import useSWR from "swr"

const getTokenSymbol = (
  _: string,
  address: string,
  selectedChain: string
): Promise<string> =>
  new Contract(
    address,
    ERC_20_ABI,
    new JsonRpcProvider(RPC[selectedChain].rpcUrls[0])
  ).symbol()

const useTokenSymbol = (address: string, selectedChain: string) => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && selectedChain.length

  return useSWR<string>(
    shouldFetch ? [`${address}_symbol`, address, selectedChain] : null,
    getTokenSymbol
  )
}

export default useTokenSymbol
