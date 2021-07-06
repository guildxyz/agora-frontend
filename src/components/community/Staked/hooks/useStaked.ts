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
    const staked: StakedType = {
      unlocked: 0,
      locked: [],
    }

    let timelock = null
    const tryToGetTimelock = async (i: number) => {
      try {
        timelock = await contract.timelocks(account, i)
        return true
      } catch (_) {
        timelock = null
        return false
      }
    }

    // eslint-disable-next-line no-await-in-loop
    for (let i = 0; await tryToGetTimelock(i); i += 1) {
      const { amount, expires } = timelock
      const expiresDate = new Date(expires.toNumber() * 1000)
      if (expires < Date.now()) {
        staked.unlocked += +formatEther(amount)
      } else {
        staked.locked.push({
          amount: +formatEther(amount),
          expires: expiresDate,
        })
      }
    }

    return staked
  }

  const { data, mutate } = useSWR(
    address ? [address, contract] : null,
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
