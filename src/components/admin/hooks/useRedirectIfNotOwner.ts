import { useWeb3React } from "@web3-react/core"
import useIsOwner from "components/[community]/hooks/useIsOwner"
import { Web3Connection } from "components/_app/Web3ConnectionManager"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"

const useRedirectIfNotOwner = () => {
  const { active } = useWeb3React()
  const router = useRouter()
  const { triedEager } = useContext(Web3Connection)

  const isOwner = useIsOwner()

  useEffect(() => {
    if (isOwner === false || (triedEager && !active))
      router.push(router.asPath.replace("admin/", ""))
  }, [isOwner, triedEager, active, router])

  return isOwner
}

export default useRedirectIfNotOwner
