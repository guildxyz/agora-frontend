import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Color from "color"
import Section from "components/admin/common/Section"
import { useState } from "react"

const Appearance = (): JSX.Element => {
  const { colorMode } = useColorMode()
  const [pickedColor, setPickedColor] = useState("var(--chakra-colors-gray-200)")
  const [error, setError] = useState("")

  const pickColor = (e) => {
    try {
      setPickedColor(Color(e.target.value).hex())
      setError("")
    } catch (err) {
      setPickedColor("var(--chakra-colors-gray-200)")
      setError("Invalid color code!")
    }
  }

  return (
    <Section
      title="Appearance"
      description="Make your community page as coherent with your brand as you can, so the members will feel familiar"
      cardType
    >
      <VStack spacing={2} alignItems="start">
        <Text>Main color</Text>
        <HStack spacing={4}>
          <Box
            w={10}
            h={10}
            rounded="full"
            transition="background 0.5s ease"
            style={{ backgroundColor: pickedColor }}
          />
          <InputGroup maxWidth={60}>
            <Input onChange={pickColor} />
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
        {error.length > 0 && (
          <Text color={colorMode === "light" ? "red.500" : "red.400"} fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </Section>
  )
}

export default Appearance
