import { Contract, ContractInterface } from "@ethersproject/contracts"
import { ExternalProvider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"

const createContract = (
  _: string,
  address: string,
  ABI: ContractInterface,
  withSigner: boolean,
  account: string
) => {
  const library = new Web3Provider(
    (window as Window & typeof globalThis & { ethereum: ExternalProvider }).ethereum
  )
  return new Contract(
    address,
    ABI,
    withSigner ? library.getSigner(account).connectUnchecked() : library
  )
}

const useContract = (
  address: string,
  ABI: ContractInterface,
  withSigner = false
): Contract => {
  const { account, chainId } = useWeb3React<Web3Provider>()

  const shouldFetch = typeof address === "string" && address.length > 0

  const { data } = useSWR(
    shouldFetch ? ["contract", address, ABI, withSigner, account, chainId] : null,
    createContract,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      compare: (a, b) => a?.address === b?.address,
    }
  )

  return data
}

export default useContract
