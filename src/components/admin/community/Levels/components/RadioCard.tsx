/* eslint-disable react/destructuring-assignment */
import { Box, useColorMode, useRadio } from "@chakra-ui/react"

const RadioCard = ({ isDisabled = false, ...props }) => {
  const { colorMode } = useColorMode()

  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" width="full">
      {!isDisabled && <input {...input} />}
      <Box
        {...checkbox}
        _disabled={{ bgColor: "red.500 " }}
        cursor="pointer"
        borderRadius="md"
        borderWidth={2}
        bgColor={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"}
        borderColor="transparent"
        fontWeight="medium"
        color={colorMode === "light" ? "gray.700" : "white"}
        _checked={{
          borderColor: colorMode === "light" ? "primary.300" : "primary.700",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
        opacity={isDisabled ? 0.5 : 1}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard
