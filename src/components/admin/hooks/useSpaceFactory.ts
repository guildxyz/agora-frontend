import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC, SpaceFactory } from "connectors"
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

const useSpaceFactory = (inputTokenAddress: string) => {
  const { chainId, library, account } = useWeb3React<Web3Provider>()
  const factoryAddress = SpaceFactory[Chains[chainId]]
  const contract = useContract(factoryAddress, SPACE_FACTORY_ABI, true)

  const approvedAddresses = (tokenOwner: string, tokenAddress: string) =>
    contract?.approvedAddresses(tokenOwner, tokenAddress)
  const spaces = (tokenAddress: string) => contract?.spaces(tokenAddress)

  // Wrapping these methods for custom errors
  const createSpace = (tokenAddress: string) =>
    callMethod("createSpace", tokenAddress)
  const setApproval = (
    tokenOwner: string,
    tokenAddress: string,
    approvalState = true
  ) => callMethod("setApproval", tokenOwner, tokenAddress, approvalState)

  // Method call wrapper to be able to use custom errors
  // Custom errors don't seem to be decoded by the provider, it just raises an "Internal JSON-RPC error", that's why this is needed
  const callMethod = async (
    methodName: string,
    ...args: Array<string | boolean> // These methods only recieve these types
  ) => {
    if (!contract || !contract[methodName]) return null
    console.log(`${methodName}(${[...args].join(", ")})`)
    try {
      const tx = await contract[methodName](...args)
      await tx.wait()
      return tx
    } catch {
      const provider = new JsonRpcProvider(RPC[Chains[chainId]].rpcUrls[0])
      const contractWithRPCProvider = new Contract(
        SpaceFactory[Chains[chainId]],
        SPACE_FACTORY_ABI,
        provider
      )
      // Throws a different error with errorName property
      await contractWithRPCProvider.callStatic[methodName](...args, {
        from: account,
        gasPrice: 100,
        gasLimit: 1000000,
      }).catch((error) => {
        console.error(error.transaction)
        throw error
      })
    }
  }

  const shouldFetchTokenAddress =
    typeof inputTokenAddress === "string" &&
    inputTokenAddress.length > 0 &&
    typeof spaces === "function"

  const { data: contractAddress, mutate: mutateContractAddress } = useSWR(
    shouldFetchTokenAddress
      ? [`${inputTokenAddress}_staking_data`, inputTokenAddress, spaces]
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