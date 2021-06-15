import { useContext } from "react"
import type { ProvidedCommunity } from "temporaryData/types"
import { CommunityContext } from "components/community/Context"

const useCommunity = (): ProvidedCommunity => useContext(CommunityContext)

export default useCommunity
