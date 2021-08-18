import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Chains, SpaceFactory } from "connectors"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import useContract from "hooks/useContract"

const useSpaceFactory = () => {
  const { chainId } = useWeb3React<Web3Provider>()
  const factoryAddress = SpaceFactory[Chains[chainId]]
  const contract = useContract(factoryAddress, SPACE_FACTORY_ABI, true)

  return {
    spaces: contract?.spaces ?? null,
    createSpace: contract?.callStatic?.createSpace ?? null,
  }
}

export default useSpaceFactory
