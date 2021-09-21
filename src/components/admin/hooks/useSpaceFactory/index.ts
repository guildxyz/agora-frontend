import { Contract } from "@ethersproject/contracts"
import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, SpaceFactory } from "connectors"
import ERC20_ABI from "constants/erc20abi.json"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import useContract from "hooks/useContract"
import useSWR from "swr"
import throwsCustomError from "./utils/throwsCustomError"

const getContractAddress = (_: string, address: string, contract: Contract) =>
  contract.spaces(address)

const getStakeToken = async (_: string, spaceContract: Contract) => {
  const address: string = await spaceContract.stakeToken()
  const stakeTokenContract = new Contract(address, ERC20_ABI)
  const data = await Promise.all([
    stakeTokenContract.name(),
    stakeTokenContract.symbol(),
    stakeTokenContract.decimals(),
  ]).then(([name, symbol, decimals]) => ({
    name,
    symbol,
    decimals,
  }))
  return { ...data, address }
}

const useSpaceFactory = (inputTokenAddress: string) => {
  const { chainId } = useWeb3React<Web3Provider>()
  const factoryAddress = SpaceFactory[Chains[chainId]]
  const contract = useContract(factoryAddress, SPACE_FACTORY_ABI, true)

  const createSpace = contract
    ? throwsCustomError<[string, string]>(contract, "createSpace")
    : undefined

  // Fetch the space address of the token
  const shouldFetch =
    typeof inputTokenAddress === "string" &&
    inputTokenAddress.length > 0 &&
    !!contract
  const { data: contractAddress, mutate: mutateContractAddress } = useSWR(
    shouldFetch ? ["spaces", inputTokenAddress, contract] : null,
    getContractAddress
  )

  // Fetch stake token data once space address is available
  const stakeTokenContract = useContract(contractAddress, ERC20_ABI)
  const { data: stakeToken, mutate: mutateStakeToken } = useSWR(
    stakeTokenContract ? ["tokenData", stakeTokenContract] : null,
    getStakeToken
  )

  const updateData = async () => {
    // Do not use Promise.all, these mutations are dependent of each other in this order
    const newContractAddress = await mutateContractAddress()
    const newStakeToken = await mutateStakeToken()
    return {
      contractAddress: newContractAddress,
      stakeToken: newStakeToken,
    }
  }

  return {
    createSpace,
    updateData,
    contractAddress,
    stakeToken,
  }
}

export default useSpaceFactory
