import { Contract } from "@ethersproject/contracts"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import useSWR from "swr"

type StakedType = {
  unlockedAmount: number
  locked: Array<{
    amount: number
    expires: Date
    id: number
  }>
}

const getTimelocks =
  (contract: Contract) =>
  async (
    _: string,

    account: string
  ): Promise<StakedType> => {
    const getStaked = async (
      i: number,
      { unlockedAmount, locked }: StakedType
    ): Promise<StakedType> => {
      // console.log("getStaked called", contract, account)

      try {
        const { amount, expires } = await contract.timelocks(account, i)
        const expiresNumber = expires.toNumber() * 1000
        if (expiresNumber < Date.now()) {
          return await getStaked(i + 1, {
            unlockedAmount: unlockedAmount + +formatEther(amount),
            locked,
          })
        }
        return await getStaked(i + 1, {
          unlockedAmount,
          locked: [
            ...locked,
            {
              amount: +formatEther(amount),
              expires: new Date(expiresNumber),
              id: i,
            },
          ],
        })
      } catch (_) {
        console.info(
          "%cThe logged error is expected, it's needed for fetching the user's timelocks. We can't prevent MetaMask from logging it",
          "color: gray"
        )
        return { unlockedAmount, locked }
      }
    }

    return getStaked(0, {
      unlockedAmount: 0,
      locked: [],
    })
  }

const useStaked = (): StakedType => {
  const {
    chainData: { contractAddress },
  } = useCommunity()
  const { account, active } = useWeb3React()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)

  const { data } = useSWR(
    active ? ["staked", account] : null,
    getTimelocks(contract),
    {
      initialData: {
        unlockedAmount: 0,
        locked: [],
      },
      refreshInterval: 10_000,
      // onSuccess: () => console.log("timelocks fetched"),
    }
  )

  // useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useStaked
