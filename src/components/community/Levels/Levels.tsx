import { Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import { useState } from "react"
import AccessIndicator, {
  LevelsStateForIndicator,
} from "./components/AccessIndicator"
import Level from "./components/Level"

const Levels = (): JSX.Element => {
  const { levels } = useCommunity()

  const [levelsStateForIndicator, setLevelsStateForIndicator] =
    useState<LevelsStateForIndicator>({})

  return (
    <Card
      isFullWidthOnMobile
      pos="relative"
      overflow="hidden"
      pl={{ base: 6, sm: 8 }}
      pr={{ base: 5, sm: 7 }}
    >
      <Stack spacing="0">
        {levels.map((level) => (
          <Level
            key={level.name}
            data={level}
            setLevelsStateForIndicator={setLevelsStateForIndicator}
          />
        ))}
      </Stack>

      <AccessIndicator levelsState={levelsStateForIndicator} />
    </Card>
  )
}

export default Levels
