import { Box, HStack, Input, Text, useColorMode, VStack } from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  onColorChange: (color: string) => void
}

const Appearance = ({ onColorChange }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const {
    register,
    formState: { errors },
  } = useFormContext()

  const pickedColor = useWatch({ name: "themeColor", defaultValue: "#e4e4e7" })

  useEffect(() => {
    if (!errors.themeColor) onColorChange(pickedColor)
  }, [pickedColor, onColorChange, errors.themeColor])

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
              bgColor={!!pickedColor && !errors.themeColor ? pickedColor : "#e4e4e7"}
            />
            <Input
              maxWidth={60}
              placeholder="#4F46E5"
              {...register("themeColor", {
                required: false,
                pattern: /^#[0-9a-f]{3}([0-9a-f]{3})?$/i,
              })}
              isInvalid={!!errors.themeColor}
            />
          </HStack>
          {!!errors.themeColor && (
            <Text
              color={colorMode === "light" ? "red.500" : "red.400"}
              fontSize="sm"
            >
              Please input a valid hexadecimal color code
            </Text>
          )}
        </VStack>
      </>
    </Section>
  )
}

export default Appearance
