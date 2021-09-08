import { Contract } from "@ethersproject/contracts"
import { Logger } from "@ethersproject/logger"
import ERC_20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

const getTokenData =
  (contract: Contract) =>
  (_: string): Promise<[string, string]> =>
    Promise.all([contract.name(), contract.symbol()]).catch((error) => {
      // This means, that the error occured because the user is on a wrong chain, if we were revalidating on this error,
      // it would occur again until the the user doesn't switch to the correct chain
      if (error.code === Logger.errors.CALL_EXCEPTION) return [null, null]
      throw error
    })

const useTokenData = (address: string, selectedChain: string) => {
  const shouldFetch = /^0x[A-F0-9]{40}$/i.test(address) && selectedChain.length > 0
  const contract = useContract(shouldFetch ? address : null, ERC_20_ABI)

  const swrResponse = useSWR<[string, string]>(
    shouldFetch ? ["tokenData", address, selectedChain] : null,
    getTokenData(contract),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    ...swrResponse,
    // Doing like this, not with initialData to make sure it fetches when shouldFetch becomes true
    data: swrResponse.data ?? [undefined, undefined],
  }
}

export default useTokenData
