import { Box, Tooltip } from "@chakra-ui/react"
import ActionCard from "components/[community]/common/ActionCard"
import { useCommunity } from "components/[community]/Context"
import { Chains } from "connectors"
import useMutagenNfts from "hooks/useMutagenNfts"
import { useMemo } from "react"
import useLevelAccess from "../Levels/components/Level/hooks/useLevelAccess"
import PlatformButton from "./components/PlatformButton"

const Platforms = (): JSX.Element => {
  const {
    communityPlatforms,
    levels: [{ requirementType, requirement }],
    parallelLevels,
    chainData,
  } = useCommunity()
  const [hasAccess, noAccessMessage] = useLevelAccess(
    requirementType,
    requirement,
    chainData.token,
    chainData.stakeToken,
    Chains[chainData.name.toLowerCase()]
  )

  /**
   * Temporary, very ugly solution for parallel levels support (when calling
   * useLevelAccess with the first level isn't enough). Currently we only use
   * parallel levels with Mutagen's NFT community, so having this custom logic here
   * is sufficient, we'll find a general solution when it's needed
   */
  const mutagenNfts = useMutagenNfts(requirementType, chainData.token)
  const enabled = useMemo(() => {
    if (parallelLevels) return !!(Array.isArray(mutagenNfts) && mutagenNfts.length)
    return hasAccess
  }, [hasAccess, mutagenNfts, parallelLevels])

  return (
    <ActionCard
      title="Platforms"
      description="All platforms are bridged together so you’ll see the same messages everywhere."
    >
      {communityPlatforms
        .filter((platform) => platform.active)
        .map((platform) => (
          <Tooltip
            key={platform.name}
            isDisabled={enabled}
            label={
              ["Wallet not connected", "Wrong network"].includes(noAccessMessage)
                ? noAccessMessage
                : "You don't have access to any of the levels"
            }
          >
            <Box>
              <PlatformButton platform={platform.name} disabled={!enabled} />
            </Box>
          </Tooltip>
        ))}
    </ActionCard>
  )
}

export default Platforms
