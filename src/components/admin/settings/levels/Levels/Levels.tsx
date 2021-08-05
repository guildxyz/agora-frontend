import { VStack } from "@chakra-ui/react"
import Section from "components/admin/Section"
import AddLevel from "./components/AddLevel"

const Levels = (): JSX.Element => (
  <Section
    title="Levels"
    description="Ordered from the most accessible to the most VIP one. Each one gives access to the lower levels too"
  >
    <VStack width="full" gap={12}>
      <AddLevel />
    </VStack>
  </Section>
)

export default Levels
