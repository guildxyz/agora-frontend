import { useWeb3React } from "@web3-react/core"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useImmutableSWR from "swr/immutable"

const getIsOwner = async (_, ownerAddresses, account) =>
  ownerAddresses.some(({ address }) => address === account?.toLowerCase())

const useIsOwner = () => {
  const { account, active } = useWeb3React()
  const { communityData } = useCommunityData()

  const shouldFetch = !!communityData && active

  const { data } = useImmutableSWR(
    shouldFetch ? ["isOwner", communityData.owner?.addresses, account] : null,
    getIsOwner
  )

  return data
}

export default useIsOwner
