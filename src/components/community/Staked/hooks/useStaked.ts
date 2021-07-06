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
    const getStaked = async (
      i: number,
      { unlocked, locked }: StakedType
    ): Promise<StakedType> => {
      try {
        const { amount, expires } = await contract.timelocks(account, i)
        const expiresNumber = expires.toNumber() * 1000
        if (expiresNumber < Date.now()) {
          return await getStaked(i + 1, {
            unlocked: unlocked + +formatEther(amount),
            locked,
          })
        }
        return await getStaked(i + 1, {
          unlocked,
          locked: [
            ...locked,
            {
              amount: +formatEther(amount),
              expires: new Date(expiresNumber),
            },
          ],
        })
      } catch (_) {
        return { unlocked, locked }
      }
    }

    const staked = await getStaked(0, {
      unlocked: 0,
      locked: [],
    })

    // console.log(staked)

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
