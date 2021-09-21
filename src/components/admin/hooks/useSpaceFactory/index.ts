import type { Contract } from "@ethersproject/contracts"
import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, SpaceFactory } from "connectors"
import ERC20_ABI from "constants/erc20abi.json"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import useContract from "hooks/useContract"
import useSWRImmutable from "swr/immutable"
import throwsCustomError from "./utils/throwsCustomError"

const getContractAddress = (_: string, address: string, contract: Contract) =>
  contract.spaces(address)

const getStakeTokenAddress = (_: string, spaceContract: Contract) =>
  spaceContract.stakeToken()

const getStakeTokenData = async (_: string, stakeTokenContract: Contract) =>
  Promise.all([
    stakeTokenContract.name(),
    stakeTokenContract.symbol(),
    stakeTokenContract.decimals(),
  ]).then(([name, symbol, decimals]) => ({
    name,
    symbol,
    decimals,
  }))

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
  const { data: spaceAddress, mutate: mutateSpaceAddress } = useSWRImmutable(
    shouldFetch ? ["spaces", inputTokenAddress, contract] : null,
    getContractAddress
  )

  // Fetch stake token address once space address is available
  const spaceContract = useContract(spaceAddress, ERC20_ABI)
  const { data: stakeTokenAddress, mutate: mutateStakeTokenAddress } =
    useSWRImmutable(
      spaceContract ? ["stakeTokenAddress", spaceContract] : null,
      getStakeTokenAddress
    )

  // Fetch stake token data (name, symbol, decimals) once the address is available
  const stakeTokenContract = useContract(stakeTokenAddress, ERC20_ABI)
  const { mutate: mutateStakeTokenData } = useSWRImmutable(
    stakeTokenContract ? ["tokenData", stakeTokenContract] : null,
    getStakeTokenData
  )

  const updateData = async () => {
    // Do not use Promise.all, these mutations are dependent of each other in this order
    const newSpaceAddress = await mutateSpaceAddress()
    const newStakeTokenAddress = await mutateStakeTokenAddress()
    const newStakeTokenData = await mutateStakeTokenData()
    return {
      contractAddress: newSpaceAddress,
      stakeToken: {
        address: newStakeTokenAddress,
        ...newStakeTokenData,
      },
    }
  }

  return {
    createSpace,
    contractAddress: spaceAddress,
  }
}

export default useSpaceFactory
