/* eslint-disable react/destructuring-assignment */
import { Box, useRadio } from "@chakra-ui/react"

const CustomRadio = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box width="full" as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        bgColor="gray.50"
        borderRadius="md"
        _checked={{
          bg: "ingido.50",
          color: "idigo.500",
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

export default CustomRadio
