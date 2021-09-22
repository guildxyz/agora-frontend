import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import useSWR from "swr"

const getIsOwner = async (_, ownerAddresses, account) =>
  ownerAddresses.some(({ address }) => address === account?.toLowerCase())

const useRedirectIfNotOwner = () => {
  const { account, active } = useWeb3React()
  const router = useRouter()
  const communityData = useCommunity()
  const { triedEager } = useContext(Web3Connection)

  const shouldFetch = !!communityData && active

  const { data } = useSWR(
    shouldFetch ? ["isOwner", communityData.owner?.addresses, account] : null,
    getIsOwner,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  useEffect(() => {
    if (data === false || (triedEager && !active))
      router.push(router.asPath.replace("admin/", ""))
  }, [data, triedEager, active, router])

  return data
}

export default useRedirectIfNotOwner
