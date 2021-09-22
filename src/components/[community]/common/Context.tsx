import { Box, Portal } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { useRouter } from "next/router"
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
} from "react"
import useSWR, { KeyedMutator } from "swr"
import { communities } from "temporaryData/communities"
import tokens from "temporaryData/tokens"
import { Community, ProvidedCommunity } from "temporaryData/types"
import useColorPalette from "../hooks/useColorPalette"
import useMemberCount from "../hooks/useMemberCount"

type CommunityContextType = {
  community: ProvidedCommunity
  mutate: KeyedMutator<Community>
}

type Props = {
  initialData?: Community
  /**
   * This is needed because we're using it for the CommunityCard components too and
   * don't want to render there unnecessary. It's an ugly abstraction this way, in
   * the long run we likely won't use it for CommunityCards and this will be removed,
   * it was just an easier solution for now
   */
  shouldRenderWrapper?: boolean
}

const fetchCommunityData = async (_: string, urlName: string) => {
  const DEBUG = false

  const localData =
    communities.find((i) => i.urlName === urlName) ??
    tokens.find((i) => i.urlName === urlName)

  const communityData: Community =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/urlName/${urlName}`
        ).then((response: Response) => (response.ok ? response.json() : localData))

  return communityData
}

const CommunityContext = createContext<CommunityContextType>({
  community: null,
  mutate: null,
})

const CommunityProvider = ({
  initialData,
  shouldRenderWrapper = true,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { chainId } = useWeb3React()
  const router = useRouter()

  const shouldFetch = router.query.community?.toString()?.length > 0

  const { data, mutate } = useSWR(
    shouldFetch ? ["community", router.query.community.toString()] : null,
    fetchCommunityData,
    {
      revalidateOnMount: !initialData,
      revalidateOnFocus: false,
      fallbackData: initialData,
    }
  )

  const membersCount = useMemberCount(data?.id, data?.levels)

  const chainData = useMemo(
    () =>
      data &&
      (data.chainData.find((chain) => chain.name === Chains[chainId]) ??
        data.chainData[0]),
    [chainId, data]
  )

  const levels = useMemo(
    () =>
      data?.levels.map((_level) => {
        const level = _level
        level.membersCount = membersCount[_level.id]
        return level
      }),
    [data?.levels, membersCount]
  )

  const availableChains = data?.chainData.map((chain) => chain.name)

  const generatedColors = useColorPalette("chakra-colors-primary", data?.themeColor)
  const colorPaletteProviderElementRef = useRef(null)

  return (
    <CommunityContext.Provider
      value={{
        community: { ...data, chainData, availableChains, levels },
        mutate,
      }}
    >
      {shouldRenderWrapper ? (
        <Box ref={colorPaletteProviderElementRef} sx={generatedColors}>
          {/* using Portal with it's parent's ref so it mounts children as they would normally be,
            but ensures that modals, popovers, etc are mounted inside instead at the end of the
            body so they'll use the provided css variables */}
          {typeof window === "undefined" ? (
            children
          ) : (
            <Portal containerRef={colorPaletteProviderElementRef}>{children}</Portal>
          )}
        </Box>
      ) : (
        children
      )}
    </CommunityContext.Provider>
  )
}

const useCommunity = (): ProvidedCommunity => useContext(CommunityContext).community
const useMutateCommunity = (): KeyedMutator<Community> =>
  useContext(CommunityContext).mutate

export { useCommunity, useMutateCommunity, CommunityProvider }
