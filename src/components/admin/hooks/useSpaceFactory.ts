import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, SpaceFactory } from "connectors"
import AGORA_SPACE_API from "constants/agoraSpaceABI.json"
import ERC20_ABI from "constants/erc20abi.json"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

const getContractAddress = (
  _: string,
  address: string,
  spaces: (address: string) => Promise<string>
) => {
  if (!address) return
  return spaces(address)
}

const useSpaceFactory = (tokenAddress: string) => {
  const { chainId } = useWeb3React<Web3Provider>()
  const factoryAddress = SpaceFactory[Chains[chainId]]
  const contract = useContract(factoryAddress, SPACE_FACTORY_ABI, true)
  const spaces = contract?.spaces ?? null
  const createSpace = contract?.createSpace ?? null

  const shouldFetchTokenAddress =
    typeof tokenAddress === "string" &&
    tokenAddress.length > 0 &&
    typeof spaces === "function"

  const { data: contractAddress, mutate } = useSWR(
    shouldFetchTokenAddress
      ? [`${tokenAddress}_staking_data`, tokenAddress, spaces]
      : null,
    getContractAddress
  )

  const spaceContract = useContract(contractAddress, AGORA_SPACE_API)

  const shouldFetchStakeTokenAddress =
    typeof contractAddress === "string" &&
    contractAddress.length > 0 &&
    !!spaceContract

  const { data: stakeTokenAddress } = useSWR(
    shouldFetchStakeTokenAddress
      ? [`${contractAddress}_stake_token_address`, spaceContract]
      : null,
    () => (spaceContract ? spaceContract.stakeToken() : Promise.reject())
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
    createSpace,
    mutateContractAddress: mutate,
    contractAddress,
    stakeToken: {
      stakeTokenAddress,
      ...stakeTokenData,
    },
  }
}

export default useSpaceFactory
