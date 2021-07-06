import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useSWR from "swr"
import { formatEther } from "@ethersproject/units"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"

type StakedType = {
  unlocked: number
  locked: Array<{
    amount: number
    expires: Date
  }>
}

const useStaked = () => {
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const { account } = useWeb3React()

  const getTimelocks = async (): Promise<StakedType> => {
    let staked: StakedType = {
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
        staked.unlocked += +formatEther(amount)
      } else {
        staked.locked.push({
          amount: +formatEther(amount),
          expires: new Date(expires),
        })
      }
    }

    return staked
  }

  const { data, mutate } = useSWR(
    !!address ? [address, contract] : null,
    getTimelocks,
    {
      initialData: {
        unlocked: 0,
        locked: [],
      },
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useStaked
