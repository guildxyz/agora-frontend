import useBalance from "hooks/useBalance"
import { Requirement, Token } from "temporaryData/types"
import useLevelsAccess from "../../../hooks/useLevelsAccess"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (
  id: number,
  requirements: Requirement[],
  token: Token | undefined,
  stakeToken: Token | undefined
): [boolean, string] => {
  // The balances will be NaN if the tokens are undefined. This is fine, since this only happens,
  // if the user is not on the correct chain, and this is handled before the balances are used
  const tokenBalance = useBalance(token)
  const neededAmount = useNeededAmount(
    requirements?.[0]?.value as number,
    stakeToken
  )
  const { data: hasAccess, error } = useLevelsAccess(id)

  if (error) return [false, error]

  if (hasAccess) return [true, ""]

  if (requirements?.[0]?.type === "NFT") return [false, "NFT not owned"]

  if (tokenBalance < neededAmount) return [false, "Insufficient balance"]

  return [false, ""]
}

export default useLevelAccess
