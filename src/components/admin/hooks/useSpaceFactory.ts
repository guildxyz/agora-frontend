import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC, SpaceFactory } from "connectors"
import AGORA_SPACE_API from "constants/agoraSpaceABI.json"
import ERC20_ABI from "constants/erc20abi.json"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import useContract from "hooks/useContract"
import { useCallback } from "react"
import useSWR from "swr"

const getContractAddress = (
  _: string,
  address: string,
  spaces: (address: string) => Promise<string>
) => spaces(address)

const getStakeTokenAddress = (_: string, stakeToken: () => Promise<string>) =>
  stakeToken()

const getTokenData = (
  _: string,
  getName: () => Promise<string>,
  getSymbol: () => Promise<string>,
  detDecimals: () => Promise<number>
) =>
  Promise.all([getName(), getSymbol(), detDecimals()]).then(
    ([name, symbol, decimals]) => ({
      name,
      symbol,
      decimals,
    })
  )

const useSpaceFactory = (inputTokenAddress: string) => {
  const { chainId, account } = useWeb3React<Web3Provider>()
  const factoryAddress = SpaceFactory[Chains[chainId]]
  const contract = useContract(factoryAddress, SPACE_FACTORY_ABI, true)

  const spaces = useCallback(
    (tokenAddress: string) => contract?.spaces(tokenAddress),
    [contract]
  )

  // Wrapping these methods for custom errors
  const createSpace = (tokenAddress: string) =>
    callMethod("createSpace", tokenAddress)

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
      })
    }
  }

  const shouldFetchTokenAddress =
    typeof inputTokenAddress === "string" && inputTokenAddress.length > 0

  const { data: contractAddress, mutate: mutateContractAddress } = useSWR(
    shouldFetchTokenAddress ? ["spaces", inputTokenAddress, spaces] : null,
    getContractAddress
  )

  const spaceContract = useContract(contractAddress, AGORA_SPACE_API)
  const stakeToken = useCallback(() => spaceContract?.stakeToken(), [spaceContract])

  const shouldFetchStakeTokenAddress =
    typeof contractAddress === "string" &&
    contractAddress.length > 0 &&
    !!spaceContract

  const { data: stakeTokenAddress, mutate: mutateStakeTokenAddress } = useSWR(
    shouldFetchStakeTokenAddress
      ? ["stakeTokenAddress", stakeToken, contractAddress]
      : null,
    getStakeTokenAddress
  )

  const stakeTokenContract = useContract(stakeTokenAddress, ERC20_ABI)
  const name = useCallback(() => stakeTokenContract?.name(), [stakeTokenContract])
  const symbol = useCallback(
    () => stakeTokenContract?.symbol(),
    [stakeTokenContract]
  )
  const decimals = useCallback(
    () => stakeTokenContract?.decimals(),
    [stakeTokenContract]
  )

  const shouldFetchTokenData =
    typeof stakeTokenAddress === "string" &&
    stakeTokenAddress.length > 0 &&
    !!stakeTokenContract

  const { data: stakeTokenData, mutate: mutateStakeTokenData } = useSWR(
    shouldFetchTokenData
      ? ["tokenData", name, symbol, decimals, stakeTokenAddress]
      : null,
    getTokenData
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
    updateData,
    contractAddress,
    stakeToken: {
      address: stakeTokenAddress,
      ...stakeTokenData,
    },
  }
}

export default useSpaceFactory
