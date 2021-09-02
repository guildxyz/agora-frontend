import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"

type StakedType = {
  unlockedAmount: number
  locked: Array<{
    amount: number
    expires: Date
    rankId: number
    id: number
  }>
}

type Timelock = { amount: BigNumber; expires: BigNumber; rankId: BigNumber }

const getTimelocks = (
  _: string,
  contract: Contract,
  account: string
): Promise<StakedType> =>
  contract.getTimelocks(account).then((timelocks) =>
    timelocks.reduce(
      (
        _acc: StakedType,
        { amount: _amount, expires: _expires, rankId: _rankId }: Timelock,
        index: number
      ) => {
        const expires = new Date(_expires.toNumber() * 1000) // Multiplying by 1000, because JS needs the timestamp in milliseconds format
        const amount = +formatEther(_amount)
        const rankId = +_rankId
        const acc = _acc
        if (+expires < Date.now()) {
          acc.unlockedAmount += amount
          return acc
        }
        acc.locked.push({
          amount,
          expires,
          rankId,
          id: index,
        })
        return acc
      },
      {
        unlockedAmount: 0,
        locked: [],
      }
    )
  )

const useStaked = (): StakedType => {
  const {
    chainData: { contractAddress },
  } = useCommunity()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)
  const { account, active } = useWeb3React()

  const { data, mutate } = useSWR(
    active ? ["staked", contract, account] : null,
    getTimelocks,
    {
      initialData: {
        unlockedAmount: 0,
        locked: [],
      },
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useStaked
