import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import { Chains } from "connectors"
import useSWR from "swr"

const fetchLevelsAccess = async (_: string, communityId: string, account: string) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API}/community/levelsAccess/${communityId}/${account}`
  )
    .then((response: Response) => (response.ok ? response.json() : null))
    .then((data) => data.find((obj) => obj.address === account.toLowerCase()).levels)

const useLevelsAccess = (levelId?: number) => {
  const { account, active, chainId } = useWeb3React()
  const { id, chainData } = useCommunity()
  const chain = Chains[chainData.name]
  const isOnRightChain = typeof chain === "number" && chainId === chain

  const shouldFetch = !!account

  const { data } = useSWR(
    shouldFetch ? ["levelsAccess", id, account] : null,
    fetchLevelsAccess,
    { refreshInterval: 10000 }
  )

  if (!active) return { data, error: "Wallet not connected" }
  if (!isOnRightChain) return { data, error: "Wrong network" }

  if (!levelId) return { data }

  return { data: data?.find((level) => level.id === levelId)?.hasAccess }
}

export default useLevelsAccess
