import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/Section"

const Appearance = (): JSX.Element => (
  <Section
    title="Appearance"
    description="Make your community page as coherent with your brand as you can, so the members will feel familiar"
    cardType
  >
    <VStack spacing={2} alignItems="start">
      <Text>Main color</Text>
      <HStack spacing={4}>
        <Box w={10} h={10} rounded="full" bgColor="indigo.500" />
        <InputGroup maxWidth={60}>
          <Input />
          <InputRightAddon px={0}>
            <Button
              width="full"
              height="full"
              rounded="none"
              fontSize="sm"
              fontWeight="normal"
            >
              Pick another
            </Button>
          </InputRightAddon>
        </InputGroup>
      </HStack>
      <Text color="gray.600" fontSize="sm">
        Generated from your image
      </Text>
    </VStack>
  </Section>
)

export default Appearance
