import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  onColorChange: (color: string) => void
}

const Appearance = ({ onColorChange }: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const colorPickTimeout = useRef(null)
  const pickedColor = useWatch({ name: "themeColor" })
  const colorChangeHandler = (e) => {
    if (colorPickTimeout.current) window.clearTimeout(colorPickTimeout.current)

    const newColor = e.target.value
    colorPickTimeout.current = setTimeout(() => onColorChange(newColor), 300)
  }

  return (
    <Section
      title="Appearance"
      description="Make your community page as coherent with your brand as you can, so the members will feel familiar"
      cardType
    >
      <VStack spacing={2} alignItems="start">
        <FormControl isInvalid={errors.themeColor}>
          <FormLabel>Main color</FormLabel>
          <HStack spacing={4}>
            <Flex
              boxSize={10}
              alignItems="center"
              justifyContent="center"
              rounded="full"
              overflow="hidden"
            >
              <Input
                display="block"
                p={0}
                border="none"
                type="color"
                minW={16}
                minH={16}
                cursor="pointer"
                placeholder="#4F46E5"
                {...register("themeColor")}
                isInvalid={errors.themeColor}
                onInput={(e) => colorChangeHandler(e)}
              />
            </Flex>
            <Text>{pickedColor || "Pick a color"}</Text>
          </HStack>
          <FormErrorMessage>{errors.themeColor?.message}</FormErrorMessage>
        </FormControl>
      </VStack>
    </Section>
  )
}

export default Appearance
