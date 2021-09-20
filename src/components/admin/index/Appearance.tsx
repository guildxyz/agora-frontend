import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useEffect, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  onColorChange: (color: string) => void
}

const Appearance = ({ onColorChange }: Props): JSX.Element => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const colorPickTimeout = useRef(null)
  const pickedColor = useWatch({ name: "themeColor" })

  useEffect(() => {
    if (colorPickTimeout.current) window.clearTimeout(colorPickTimeout.current)

    colorPickTimeout.current = setTimeout(() => onColorChange(pickedColor), 300)
  }, [pickedColor])

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
              />
            </Flex>
            <Input
              maxWidth={40}
              value={pickedColor}
              onChange={(e) => setValue("themeColor", e.target.value)}
              placeholder="Pick a color"
            />
          </HStack>
          <FormErrorMessage>{errors.themeColor?.message}</FormErrorMessage>
        </FormControl>
      </VStack>
    </Section>
  )
}

export default Appearance
