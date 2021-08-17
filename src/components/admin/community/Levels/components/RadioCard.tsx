/* eslint-disable react/destructuring-assignment */
import { Box, useColorMode, useRadio } from "@chakra-ui/react"

const RadioCard = (props) => {
  const { colorMode } = useColorMode()

  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" width="full">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="md"
        bgColor={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"}
        fontWeight="medium"
        color={colorMode === "light" ? "gray.700" : "white"}
        _checked={{
          bgColor: colorMode === "light" ? "primary.100" : "primary.300",
          color: colorMode === "light" ? "primary.600" : "primary.800",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard
