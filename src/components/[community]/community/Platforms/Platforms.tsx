import { Box, Tooltip } from "@chakra-ui/react"
import ActionCard from "components/[community]/common/ActionCard"
import { useCommunity } from "components/[community]/common/Context"
import { useMemo } from "react"
import useLevelsAccess from "../Levels/hooks/useLevelsAccess"
import PlatformButton from "./components/PlatformButton"

const Platforms = (): JSX.Element => {
  const { communityPlatforms } = useCommunity()
  const { data: levelsAccess, error } = useLevelsAccess()
  const enabled = useMemo(
    () => !error && levelsAccess?.some((level) => level.hasAccess),
    [error, levelsAccess]
  )

  return (
    <ActionCard
      title="Platforms"
      description="Join the Telegram and Discord channels of this community here."
    >
      {communityPlatforms
        .filter((platform) => platform.active)
        .map((platform) => (
          <Tooltip
            key={platform.name}
            isDisabled={enabled}
            label={error ?? "You don't have access to any of the levels"}
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
