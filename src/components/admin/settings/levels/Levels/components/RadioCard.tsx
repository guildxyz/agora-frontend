/* eslint-disable react/destructuring-assignment */
import { Box, useRadio } from "@chakra-ui/react"

const RadioCard = (props) => {
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
        bgColor="gray.50"
        fontWeight="medium"
        color="gray.700"
        _checked={{
          bgColor: "indigo.50",
          color: "indigo.600",
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
