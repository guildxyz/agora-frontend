import { Contract, ContractInterface } from "@ethersproject/contracts"
import { ExternalProvider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const createContract = (
  _: string,
  address: string,
  ABI: string,
  withSigner: boolean,
  account: string
) => {
  // console.log(`createContract called - `, address, account)
  if (typeof window === "undefined") return

  const library = new Web3Provider(
    (window as Window & typeof globalThis & { ethereum: ExternalProvider }).ethereum
  )
  return new Contract(
    address,
    JSON.parse(ABI),
    withSigner ? library.getSigner(account).connectUnchecked() : library
  )
}

const useContract = (
  address: string,
  ABI: ContractInterface,
  withSigner = false
): Contract => {
  const { account, chainId } = useWeb3React<Web3Provider>()

  const shouldFetch =
    typeof address === "string" &&
    typeof account === "string" &&
    address.length > 0 &&
    account.length > 0

  const { data } = useSWR(
    shouldFetch
      ? ["contract", address, JSON.stringify(ABI), withSigner, account, chainId]
      : null,
    createContract,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      compare: (a, b) =>
        a?.address === b?.address && a?.signer
          ? a?.signer?.getAddress() === b?.signer?.getAddress()
          : true,
      initialData: createContract(
        "initial contract",
        address,
        JSON.stringify(ABI),
        withSigner,
        account
      ),
    }
  )

  return data
}

export default useContract
