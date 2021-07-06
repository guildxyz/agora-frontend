import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useSWR from "swr"
import { formatEther } from "@ethersproject/units"

type StakedAmountsType = {
  unlocked: number
  locked: Array<{
    amount: number
    expires: Date
  }>
}

const useStakedAmounts = () => {
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const { account } = useWeb3React()

  const getTimelocks = async (): Promise<StakedAmountsType> => {
    let stakedAmounts: StakedAmountsType = {
      unlocked: 0,
      locked: [],
    }

    let timelock = null
    const tryToGetTimelock = async (i: number) => {
      try {
        timelock = await contract.timelocks(account, i)
        return true
      } catch (_) {
        return false
      }
    }

    for (let i = 0; await tryToGetTimelock(i); i++) {
      const { amount, expires: _expires } = timelock
      const expires = _expires.toNumber() * 1000
      if (expires < Date.now()) {
        stakedAmounts.unlocked += +formatEther(amount)
      } else {
        stakedAmounts.locked.push({
          amount: +formatEther(amount),
          expires: new Date(expires),
        })
      }
    }

    return stakedAmounts
  }

  const { data } = useSWR(!!address ? [address, contract] : null, getTimelocks, {
    initialData: {
      unlocked: 0,
      locked: [],
    },
  })

  return data
}

export default useStakedAmounts
