import { Stack, StackDivider } from "@chakra-ui/react"
import Card from "components/common/Card"
import { useContext } from "react"
import { CommunityContext } from "../Context"
import Level from "./components/Level"

const Levels = (): JSX.Element => {
  const { levels } = useContext(CommunityContext)

  return (
    <Card py="10" px="6">
      <Stack spacing="10" divider={<StackDivider />}>
        {levels.map((level) => (
          <Level key={level.name} data={level} />
        ))}
      </Stack>
    </Card>
  )
}

export default Levels
