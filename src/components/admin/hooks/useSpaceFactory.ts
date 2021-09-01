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
) => spaces(address)

const useSpaceFactory = (tokenAddress: string) => {
  const { chainId } = useWeb3React<Web3Provider>()
  const factoryAddress = SpaceFactory[Chains[chainId]]
  const contract = useContract(factoryAddress, SPACE_FACTORY_ABI, true)
  const spaces = contract?.spaces
  const createSpace = contract?.createSpace
  const setApproval = contract?.setApproval
  const approvedAddresses = contract?.approvedAddresses

  const shouldFetchTokenAddress =
    typeof tokenAddress === "string" &&
    tokenAddress.length > 0 &&
    typeof spaces === "function"

  const { data: contractAddress, mutate: mutateContractAddress } = useSWR(
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

  const { data: stakeTokenAddress, mutate: mutateStakeTokenAddress } = useSWR(
    shouldFetchStakeTokenAddress
      ? [`${contractAddress}_stake_token_address`, spaceContract, contractAddress]
      : null,
    () => (spaceContract ? spaceContract.stakeToken() : Promise.reject())
  )

  const stakeTokenContract = useContract(stakeTokenAddress, ERC20_ABI)

  const shouldFetchTokenData =
    typeof stakeTokenAddress === "string" && stakeTokenAddress.length > 0

  const { data: stakeTokenData, mutate: mutateStakeTokenData } = useSWR(
    shouldFetchTokenData
      ? [`${stakeTokenAddress}_data`, stakeTokenContract, stakeTokenAddress]
      : null,
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

  const updateData = async () => {
    // Do not use Promise.all, these mutations are dependent of each other in this order
    const newContractAddress = await mutateContractAddress()
    const newStakeTokenAddress = await mutateStakeTokenAddress()
    const newStakeTokenData = await mutateStakeTokenData()
    return {
      contractAddress: newContractAddress,
      stakeToken: {
        address: newStakeTokenAddress,
        ...newStakeTokenData,
      },
    }
  }

  return {
    createSpace,
    setApproval,
    approvedAddresses,
    updateData,
    contractAddress,
    stakeToken: {
      address: stakeTokenAddress,
      ...stakeTokenData,
    },
  }
}

export default useSpaceFactory
