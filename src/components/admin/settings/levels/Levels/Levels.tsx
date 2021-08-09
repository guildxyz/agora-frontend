import { Button, Divider, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import Section from "components/admin/Section"
import { Plus } from "phosphor-react"
import { useState } from "react"
import AddLevel from "./components/AddLevel"

const Levels = (): JSX.Element => {
  // Temporary - we'Ll need to use some type of form management library, and store these values together with the other form control values
  const [levels, setLevels] = useState([])

  // We'll also need to change this and extend it with some logic (e.g. only allow the user to add a new level if the inputs in the previous level are valid)
  const addLevel = () => {
    setLevels([...levels, levels.length + 1])
  }

  const removeLevel = (levelIndex: number) => {
    const oldList = [...levels]
    const newList = oldList.filter((i) => i !== levelIndex)

    setLevels(newList)
  }

  return (
    <Section
      title="Levels"
      description="Ordered from the most accessible to the most VIP one. Each one gives access to the lower levels too"
    >
      <>
        {levels.length > 0 ? (
          <VStack width="full" spacing={8}>
            {levels.map((level) => (
              <AddLevel key={level} onRemove={() => removeLevel(level)} />
            ))}
          </VStack>
        ) : (
          <Text colorScheme="gray" pl={4}>
            There aren't any levels
          </Text>
        )}

        <HStack width="full" spacing={2}>
          <Divider borderBottomWidth={2} borderColor="gray.300" />
          <Button
            width={60}
            variant="ghost"
            leftIcon={<Icon as={Plus} />}
            onClick={addLevel}
          >
            Add level
          </Button>
          <Divider borderBottomWidth={2} borderColor="gray.300" />
        </HStack>
      </>
    </Section>
  )
}

export default Levels
