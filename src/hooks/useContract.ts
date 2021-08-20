import { Contract, ContractInterface } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const createContract =
  (library: Web3Provider, ABI: ContractInterface) =>
  (_: string, address: string, withSigner: boolean, account: string) =>
    // console.log(`createContract called - `, address, account)
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
      revalidateOnMount: false,
      compare: (a, b) =>
        a?.address === b?.address && a?.signer
          ? a?.signer?.getAddress() === b?.signer?.getAddress()
          : true,
      initialData: library
        ? createContract(library, ABI)(
            "initial contract",
            address,
            withSigner,
            account
          )
        : null,
    }
  )

  return data
}

export default useContract
