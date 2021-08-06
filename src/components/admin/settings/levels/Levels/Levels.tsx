import { Button, Divider, HStack, Icon, VStack } from "@chakra-ui/react"
import Section from "components/admin/Section"
import { Plus } from "phosphor-react"
import AddLevel from "./components/AddLevel"

const Levels = (): JSX.Element => (
  <Section
    title="Levels"
    description="Ordered from the most accessible to the most VIP one. Each one gives access to the lower levels too"
  >
    <>
      <VStack width="full" gap={12}>
        <AddLevel />
      </VStack>

      <HStack width="full" spacing={2}>
        <Divider borderBottomWidth={2} borderColor="gray.300" />
        <Button width={60} variant="ghost" leftIcon={<Icon as={Plus} />}>
          Add level
        </Button>
        <Divider borderBottomWidth={2} borderColor="gray.300" />
      </HStack>
    </>
  </Section>
)

export default Levels
