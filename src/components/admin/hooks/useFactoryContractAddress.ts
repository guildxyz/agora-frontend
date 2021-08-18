import useSWR from "swr"
import useSpaceFactory from "./useSpaceFactory"

const useFactoryContractAddress = (tokenAddress) => {
  const { spaces } = useSpaceFactory()

  const { data, mutate } = useSWR(
    [`${tokenAddress}_staking_data`, tokenAddress],
    (_: string, address?: string) => {
      if (!address) return
      return spaces(address)
    }
  )

  return {
    contractAddress: data,
    mutate,
  }
}

export default useFactoryContractAddress
