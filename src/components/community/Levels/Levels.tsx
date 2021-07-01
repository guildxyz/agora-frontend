import { useState, useEffect } from "react"
import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import Level from "./components/Level"
import AccessIndicator from "./components/AccessIndicator"

type LevelPosObj = {
  [x: string]: number
}

const Levels = (): JSX.Element => {
  const { levels } = useCommunity()
  const [levelsPos, setLevelsPos] = useState<LevelPosObj>({})
  const [highestLevelPos, setHighestLevelPos] = useState(0)
  const [hoverLevelPos, setHoverLevelPos] = useState(0)

  useEffect(() => {
    setHighestLevelPos(
      Object.values(levelsPos).reduce((a: number, b: number): number => a + b, 0)
    )
  }, [levelsPos])

  const onAccessChangeHandler = (levelName: string, positionY: number) => {
    if (levelsPos[levelName] !== positionY) {
      setLevelsPos({ ...levelsPos, [levelName]: positionY })
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

      <AccessIndicator
        {...{
          hoverLevelPos,
          highestLevelPos,
        }}
      />
    </Card>
  )
}

export default Levels
