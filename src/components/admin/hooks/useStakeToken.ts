import AGORA_SPACE_API from "constants/agoraSpaceABI.json"
import ERC20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

const useStakeToken = (contractAddress: string) => {
  const contract = useContract(contractAddress, AGORA_SPACE_API)

  const shouldFetchStakeTokenAddress =
    typeof contractAddress === "string" && contractAddress.length > 0

  const { data: stakeTokenAddress } = useSWR(
    shouldFetchStakeTokenAddress
      ? [`${contractAddress}_stake_token_address`, contract]
      : null,
    async () => contract.stakeToken()
  )

  const stakeTokenContract = useContract(stakeTokenAddress, ERC20_ABI)

  const shouldFetchTokenData =
    typeof stakeTokenAddress === "string" && stakeTokenAddress.length > 0

  const { data: stakeTokenData } = useSWR(
    shouldFetchTokenData ? [`${stakeTokenAddress}_data`, stakeTokenContract] : null,
    () =>
      Promise.all([
        stakeTokenContract.name(),
        stakeTokenContract.symbol(),
        stakeTokenContract.decimals(),
      ]).then(([name, symbol, decimals]) => ({
        name,
        symbol,
        decimals,
      }))
  )

  return {
    stakeTokenAddress,
    ...stakeTokenData,
  }
}

export default useStakeToken
