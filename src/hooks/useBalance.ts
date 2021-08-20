import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "constants/erc20abi.json"
import useSWR from "swr"
import type { Token } from "temporaryData/types"
import useContract from "./useContract"

const getBalance =
  (contract: Contract) =>
  async (_: string, address: string, decimals: number): Promise<number> =>
    // console.log("getBalance called", address, decimals, contract)
    contract.balanceOf(address).then((balance) => +formatUnits(balance, decimals))

const useBalance = (token: Token): number => {
  const { chainId, account } = useWeb3React<Web3Provider>()
  const tokenContract = useContract(token?.address, ERC20_ABI)

  const shouldFetch =
    typeof account === "string" && !!token && typeof token.address === "string"

  const { data } = useSWR(
    shouldFetch
      ? ["balance", account, token?.decimals, chainId, token?.address]
      : null,
    getBalance(tokenContract),
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
