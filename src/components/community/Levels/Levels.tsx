import { useState } from "react"
import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import Level from "./components/Level"
import AccessIndicator from "./components/AccessIndicator"

const Levels = (): JSX.Element => {
  const { levels } = useCommunity()
  const [highestLevelPos, setHighestLevelPos] = useState(0)
  const [hoverLevelPos, setHoverLevelPos] = useState(0)

  const onAccessChangeHandler = (positionY: number) => {
    // 'highestLevelPos' is basically the cumulated height of the Level components where the 'hasAccess' state is set to true.
    if (highestLevelPos < positionY) {
      setHighestLevelPos(
        (latestHighestLevelPos) => latestHighestLevelPos + positionY
      )
    }
  }

  return (
    <Card pos="relative" overflow="hidden" pl="8" pr="7">
      <Stack spacing="0">
        {levels.map((level) => (
          <Level
            key={level.name}
            data={level}
            onAccessChange={onAccessChangeHandler}
            onHoverChange={setHoverLevelPos}
          />
        ))}
      </Stack>

      <AccessIndicator {...{ hoverLevelPos, highestLevelPos }} />
    </Card>
  )
}

export default Levels
