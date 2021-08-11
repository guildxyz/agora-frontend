import { Box, HStack, Input, Text, useColorMode, VStack } from "@chakra-ui/react"
import Color from "color"
import Section from "components/admin/common/Section"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

type Props = {
  onColorChange: (color: string) => void
}

const Appearance = ({ onColorChange }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const [pickedColor, setPickedColor] = useState("var(--chakra-colors-gray-200)")
  const [error, setError] = useState("")

  const pickColor = (e) => {
    try {
      const newColor = Color(e.target.value).hex()
      setPickedColor(newColor)
      setError("")
      onColorChange(newColor)
    } catch (err) {
      setPickedColor("var(--chakra-colors-gray-200)")
      setError("Invalid color code!")
      onColorChange(null)
    }
  }

  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Section
      title="Appearance"
      description="Make your community page as coherent with your brand as you can, so the members will feel familiar"
      cardType
    >
      <>
        <VStack spacing={2} alignItems="start">
          <Text>Main color</Text>
          <HStack spacing={4}>
            <Box
              w={10}
              h={10}
              minW={10}
              rounded="full"
              transition="background 0.5s ease"
              style={{ backgroundColor: pickedColor }}
            />
            <Input
              maxWidth={60}
              onChange={pickColor}
              placeholder="#4F46E5"
              {...register("themeColor")}
              isInvalid={!!errors.themeColor}
            />
          </HStack>
          {error.length > 0 && (
            <Text
              color={colorMode === "light" ? "red.500" : "red.400"}
              fontSize="sm"
            >
              {error}
            </Text>
          )}
        </VStack>
      </>
    </Section>
  )
}

export default Appearance
