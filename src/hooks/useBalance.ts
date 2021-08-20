import { Contract } from "@ethersproject/contracts"
import { ExternalProvider, Web3Provider } from "@ethersproject/providers"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "constants/erc20abi.json"
import useSWR from "swr"
import type { Token } from "temporaryData/types"

const getBalance = async (
  _: string,
  address: string,
  decimals: number,
  tokenAddress: string
): Promise<number> => {
  // console.log("getBalance called", address, decimals, tokenAddress)
  const library = new Web3Provider(
    (window as Window & typeof globalThis & { ethereum: ExternalProvider }).ethereum
  )

  return new Contract(tokenAddress, ERC20_ABI, library)
    .balanceOf(address)
    .then((balance) => +formatUnits(balance, decimals))
}

const useBalance = (token: Token): number => {
  const { chainId, account } = useWeb3React<Web3Provider>()

  const shouldFetch =
    typeof account === "string" && !!token && typeof token.address === "string"

  const { data } = useSWR(
    shouldFetch
      ? ["balance", account, token?.decimals, token?.address, chainId]
      : null,
    getBalance,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      dedupingInterval: 5000,
      refreshInterval: 10_000,
      // onSuccess: () => console.log("balance fetched", token.symbol),
    }
  )

  // useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useBalance
