import { useWeb3React } from "@web3-react/core"
import useBalance from "hooks/useBalance"
import useMutagenNfts from "hooks/useMutagenNfts"
import { Requirement, Token } from "temporaryData/types"
import useNeededAmount from "../../../hooks/useNeededAmount"

const useLevelAccess = (
  requirements: Requirement[],
  token: Token | undefined,
  stakeToken: Token | undefined,
  chain: number
): [boolean, string] => {
  const tokenBalance = useBalance(token)
  const stakeBalance = useBalance(stakeToken)
  const ownedNfts = useMutagenNfts(requirements?.[0]?.type, token)
  const neededAmount = useNeededAmount(
    requirements?.[0]?.value as number,
    stakeToken
  )
  const { active, chainId } = useWeb3React()
  const isOnRightChain = typeof chain === "number" && chainId === chain

  // if (!active) return [false, "Wallet not connected"]

  // if (!isOnRightChain) return [false, "Wrong network"]

  // if (requirements?.[0].type === "HOLD" && requirements?.[0].value < 0) return [tokenBalance > 0, ""]

  // if (requirements?.[0].type === "OPEN") return [true, ""]

  // if (stakeBalance >= requirements?.[0].value) return [true, ""]

  // if (tokenBalance === undefined || tokenBalance < neededAmount)
  //   return [false, "Insufficient balance"]

  // if (requirements?.[0].type === "HOLD") return [true, ""]

  // if (requirements?.[0].type === "NFT_HOLD")
  //   return ownedNfts?.includes(requirements?.[0].data) ? [true, ""] : [false, "NFT not owned"]

  return [false, ""]
}

export default useLevelAccess
