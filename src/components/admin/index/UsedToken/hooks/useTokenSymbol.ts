import { Contract } from "@ethersproject/contracts"
import ERC_20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

const getTokenSymbol = (_: string, contract: Contract): Promise<string> =>
  contract.symbol()

const useTokenSymbol = (address: string, selectedChain: string) => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && selectedChain.length
  const contract = useContract(shouldFetch ? address : null, ERC_20_ABI)

  return useSWR<string>(
    shouldFetch ? [`${address}_symbol`, contract] : null,
    getTokenSymbol,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )
}

export default useTokenSymbol
