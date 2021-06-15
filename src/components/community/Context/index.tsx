import { createContext, useEffect, useState } from "react"
import { Chains } from "connectors"
import { useWeb3React } from "@web3-react/core"
import type { Community } from "temporaryData/communities"
import type { ProvidedCommunity } from "temporaryData/types"

type Props = {
  data: Community
  children: JSX.Element
}

const CommunityContext = createContext<ProvidedCommunity | null>(null)

const CommunityProvider = ({ data, children }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const [communityData, setCommunityData] = useState<Community | null>(data)
  const [dataToProvide, setDataToProvide] = useState<ProvidedCommunity | null>({
    ...data,
    chainData: data.chainData[Chains[chainId]],
  })

  useEffect(() => setCommunityData(data), [data])

  useEffect(() => {
    if (communityData) {
      setDataToProvide({
        ...communityData,
        chainData: communityData.chainData[Chains[chainId]],
      })
    }
  }, [chainId, communityData])

  return (
    <CommunityContext.Provider value={dataToProvide}>
      {children}
    </CommunityContext.Provider>
  )
}

export { CommunityContext, CommunityProvider }
