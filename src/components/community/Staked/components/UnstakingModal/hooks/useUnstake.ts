import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useBalance from "hooks/useBalance"
import { parseEther, formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import useSWR from "swr"
import { Contract } from "@ethersproject/contracts"

type ReturnType = {
  canUnstake: boolean
  unstake: () => Promise<any>
  expirity: number
}

const getExpirity = async (contract: Contract, account: string) => {
  const { amount, expires } = await contract.timelocks(account, 0)
  // formatEther(amount)
  return expires.toNumber() * 1000 - Date.now()
}

const useUnstake = (): ReturnType => {
  const {
    chainData: {
      contract: { address },
      stakeToken,
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const { data: staked } = useBalance(stakeToken)
  const { account } = useWeb3React()

  const shouldFetch = !!contract && !!account

  const { data: expirity } = useSWR(
    shouldFetch ? [contract, account] : null,
    getExpirity
  )

  const unstake = async () => {
    const weiAmount = parseEther(staked.toString())
    const tx = await contract.withdraw(weiAmount)
    return tx
  }

  return { unstake, expirity, canUnstake: expirity <= 0 }
}

export default useUnstake
