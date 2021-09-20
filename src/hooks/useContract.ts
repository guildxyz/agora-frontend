import type { ContractInterface } from "@ethersproject/contracts"
import { Contract } from "@ethersproject/contracts"
import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const createContract = async (
  _: string,
  address: string,
  withSigner: boolean,
  account: string,
  library: Web3Provider,
  ABI: ContractInterface
) =>
  new Contract(
    address,
    ABI,
    withSigner ? library.getSigner(account).connectUnchecked() : library
  )

const useContract = (
  address: string,
  ABI: ContractInterface,
  withSigner = false
): Contract => {
  const { account, chainId, library } = useWeb3React<Web3Provider>()

  const shouldFetch =
    typeof address === "string" &&
    typeof account === "string" &&
    address.length > 0 &&
    account.length > 0 &&
    !!library

  /**
   * Passing library in the dependency array is fine, its basically a constant
   * reference, won't mix up the cache keys
   */
  const { data: contract } = useSWR(
    shouldFetch
      ? ["contract", address, withSigner, account, library, ABI, chainId]
      : null,
    createContract,
    { revalidateOnFocus: false }
  )

  return contract
}

export default useContract
