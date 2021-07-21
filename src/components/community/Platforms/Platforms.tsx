import { Box, Tooltip } from "@chakra-ui/react"
import ActionCard from "components/common/ActionCard"
import { useCommunity } from "components/community/Context"
import useLevelAccess from "../Levels/components/Level/hooks/useLevelAccess"
import PlatformButton from "./components/PlatformButton"
import { PlatformName } from "./platformsContent"

const Platforms = (): JSX.Element => {
  const {
    platforms,
    levels: [firstLevel],
  } = useCommunity()
  const [hasAccess, noAccessMessage] = useLevelAccess(firstLevel.accessRequirement)

  return (
    <ActionCard
      title="Platforms"
      description="All platforms are bridged together so you’ll see the same messages everywhere."
    >
      {(Object.keys(platforms) as PlatformName[])
        .filter((platform) => platforms[platform].active)
        .map((platform) => (
          <Tooltip
            key={platform}
            isDisabled={hasAccess}
            label={
              noAccessMessage === "Wallet not connected"
                ? noAccessMessage
                : "You don't have access to any of the levels"
            }
          >
            <Box>
              <PlatformButton platform={platform} disabled={!hasAccess} />
            </Box>
          </Tooltip>
        ))}
    </ActionCard>
  )
}

export default Platforms
