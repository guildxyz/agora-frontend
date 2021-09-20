import { Contract } from "@ethersproject/contracts"
import { formatUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "constants/erc20abi.json"
import useSWR from "swr"
import type { Token } from "temporaryData/types"
import useContract from "./useContract"

const getBalance = (
  _: string,
  address: string,
  decimals: number,
  contract: Contract
): Promise<number> =>
  contract.balanceOf(address).then((balance) => +formatUnits(balance, decimals))

const useBalance = (token: Token): number => {
  const { chainId, account } = useWeb3React()
  const tokenContract = useContract(token?.address, ERC20_ABI)

  const shouldFetch =
    typeof account === "string" &&
    typeof token?.address === "string" &&
    token.address.length > 0 &&
    !!tokenContract

  const { data } = useSWR(
    shouldFetch
      ? ["balance", account, token?.decimals, tokenContract, chainId]
      : null,
    getBalance,
    { revalidateOnFocus: false, refreshInterval: 10_000 }
  )

  return data
}

export default useBalance
