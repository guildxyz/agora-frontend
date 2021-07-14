import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import type { AccessRequirement } from "temporaryData/types"
import useNeededAmount from "../../../hooks/useNeededAmount"

const hasAccessToLevel = (
  requirement: AccessRequirement,
  stakeBalance: number,
  tokenBalance: number,
  _neededAmount: number | null = null
): [boolean, string] => {
  if (requirement.type === "open") return [true, ""]

  if (stakeBalance >= requirement.amount) return [true, ""]

  const neededAmount = _neededAmount ?? requirement.amount

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  if (requirement.type === "hold") return [true, ""]

  if (requirement.type === "stake") return [false, ""]

  return [false, ""]
}

const useLevelAccess = (accessRequirement: AccessRequirement): [boolean, string] => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const { data: tokenBalance } = useBalance(token)
  const { data: stakeBalance } = useBalance(stakeToken)
  const neededAmount = useNeededAmount(accessRequirement)
  const { active } = useWeb3React()

  if (!active) return [false, "Wallet not connected"]

  return hasAccessToLevel(
    accessRequirement,
    stakeBalance,
    tokenBalance,
    neededAmount
  )
}

export { useLevelAccess, hasAccessToLevel }
