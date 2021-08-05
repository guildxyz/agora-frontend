import { Box, Portal } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import React, { createContext, useContext, useMemo, useRef } from "react"
import { Community, ProvidedCommunity } from "temporaryData/types"
import useColorPalette from "./hooks/useColorPalette"
import useMemberCount from "./hooks/useMemberCount"

type Props = {
  data: Community
  /**
   * This is needed because we're using it for the CommunityCard components too and
   * don't want to render there unnecessary. It's an ugly abstraction this way, in
   * the long run we likely won't use it for CommunityCards and this will be removed,
   * it was just an easier solution for now
   */
  shouldRenderWrapper?: boolean
  children: JSX.Element
}

const CommunityContext = createContext<ProvidedCommunity | null>(null)

const CommunityProvider = ({
  data,
  shouldRenderWrapper = true,
  children,
}: Props): JSX.Element => {
  const { chainId } = useWeb3React()

  const membersCount = useMemberCount(data.id)

  const chainData = useMemo(
    () =>
      data.chainData.find((_) => _.name.toLowerCase() === Chains[chainId]) ??
      data.chainData[0],
    [chainId, data]
  )

  const levels = useMemo(
    () =>
      data.levels.map((_level) => {
        const level = _level
        level.membersCount = membersCount[_level.id] ?? level.membersCount
        return level
      }),
    [data.levels, membersCount]
  )

  const availableChains = data.chainData.map((_) => _.name.toLowerCase())

  const generatedColors = useColorPalette("chakra-colors-primary", data.themeColor)
  const colorPaletteProviderElementRef = useRef(null)

  return (
    <CommunityContext.Provider
      value={{
        ...data,
        chainData,
        availableChains,
        levels,
      }}
    >
      {shouldRenderWrapper ? (
        <Box ref={colorPaletteProviderElementRef} sx={generatedColors}>
          {/* using Portal with it's parent's ref so it mounts children as they would normally be,
            but ensures that modals, popovers, etc are mounted inside instead at the end of the
            body so they'll use the provided css variables */}
          <Portal containerRef={colorPaletteProviderElementRef}>{children}</Portal>
        </Box>
      ) : (
        children
      )}
    </CommunityContext.Provider>
  )
}

const useCommunity = (): ProvidedCommunity => useContext(CommunityContext)

export { useCommunity, CommunityProvider }