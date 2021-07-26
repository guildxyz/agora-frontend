import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useSWR from "swr"

const getJoinedCommunities = async (_: string, address: string): Promise<number[]> =>
  fetch(`${process.env.NEXT_PUBLIC_API}/getUserMembership/${address}`).then(
    (response) =>
      response.ok ? response.json().then((data) => data.communities) : []
  )

const useIsMemberOfCommunity = (): boolean => {
  const { id } = useCommunity()
  const { account } = useWeb3React()
  const { data: joinedCommunitites } = useSWR(
    ["joined_communities", account],
    getJoinedCommunities
  )

  return joinedCommunitites?.includes(id)
}

export default useIsMemberOfCommunity
