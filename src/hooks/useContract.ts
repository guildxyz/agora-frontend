import type { ContractInterface } from "@ethersproject/contracts"
import { Contract } from "@ethersproject/contracts"
import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const createContract =
  (library: Web3Provider, ABI: ContractInterface) =>
  async (_: string, address: string, withSigner: boolean, account: string) => {
    console.log(`createContract called - `, address, account)
    const contract = new Contract(
      address,
      ABI,
      withSigner ? library.getSigner(account).connectUnchecked() : library
    )
    const signerAddress = await contract.signer?.getAddress()
    return { contract, signerAddress }
  }

const useContract = (
  address: string,
  ABI: ContractInterface,
  withSigner = false
): Contract => {
  const { account, chainId, library, active } = useWeb3React<Web3Provider>()

  const shouldFetch =
    typeof address === "string" &&
    typeof account === "string" &&
    address.length > 0 &&
    account.length > 0 &&
    !!library

  const { data } = useSWR(
    shouldFetch ? ["contract", address, withSigner, account, chainId, active] : null,
    createContract(library, ABI),
    {
      revalidateOnFocus: false,
      compare: (left, right) =>
        left?.contract?.address === right?.contract.address &&
        left?.signerAddress === right?.signerAddress,
    }
  )

  return data?.contract
}

export default useContract
