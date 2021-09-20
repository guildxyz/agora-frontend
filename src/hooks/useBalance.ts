import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useBalances } from "components/index/BalancesContext"
import ERC20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import type { Token } from "temporaryData/types"

const getBalance = async (
  _: string,
  address: string,
  tokenContract: Contract,
  decimals: number
): Promise<number> =>
  tokenContract &&
  tokenContract.balanceOf(address).then((balance) => +formatUnits(balance, decimals))

/**
 * Only fetches the balance of the param token if the hook call is not under a
 * BalancesProvider, otherwise it takes the value from there
 */
const useBalance = (token: Token): number => {
  const fromMulticall = useBalances(token?.address)
  const { library, chainId, account } = useWeb3React<Web3Provider>()
  const tokenContract = useContract(token?.address, ERC20_ABI)

  const shouldFetch =
    typeof account === "string" &&
    !!library &&
    typeof token?.address === "string" &&
    typeof fromMulticall === "undefined"

  const { data, mutate } = useSWR(
    shouldFetch
      ? ["balance", account, tokenContract, token.decimals, chainId]
      : null,
    getBalance,
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return fromMulticall || data
}

export default useBalance
