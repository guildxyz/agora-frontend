import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"

const useLevelAccess = (type: string, neededAmount: number): [boolean, string] => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const { data: tokenBalance } = useBalance(token)
  const { data: stakeBalance } = useBalance(stakeToken)
  const { active } = useWeb3React()

  if (!active) return [false, "Wallet not connected"]

  // If we need open levels to be accessible without wallet, this one should be the first if
  if (type === "open") return [true, ""]

  if (Number.isNaN(neededAmount)) return [false, "Loading requirement amount"]

  if (stakeBalance >= neededAmount) return [true, ""]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (type === "hold") return [true, ""]

  if (type === "stake") return [false, ""]
}

export default useLevelAccess
