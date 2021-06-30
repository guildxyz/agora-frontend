import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useBalance from "hooks/useBalance"
import { parseEther } from "@ethersproject/units"

const useUnstake = () => {
  const {
    chainData: {
      contract: { address },
      stakeToken,
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const { data: staked } = useBalance(stakeToken)

  const unstake = async () => {
    const weiAmount = parseEther(staked.toString())
    const tx = await contract.withdraw(weiAmount)
    return tx
  }

  return unstake
}

export default useUnstake
