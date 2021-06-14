import { createContext } from "react"
import type { Community } from "temporaryData/communities"

const CommunityContext = createContext<Community>(undefined)
const CommunityProvider = CommunityContext.Provider

export { CommunityContext, CommunityProvider }
