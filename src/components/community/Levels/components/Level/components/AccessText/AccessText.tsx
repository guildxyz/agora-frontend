import { Box, Stack, Text } from "@chakra-ui/react"

type Props = {
  text: string
  icon: JSX.Element
}

const AccessText = ({ text, icon }: Props): JSX.Element => (
  <Box display={{ base: "none", md: "block" }}>
    <Stack spacing="2" direction={{ base: "row-reverse", sm: "row" }}>
      <Text fontSize={{ base: "sm", lg: "md" }} fontWeight="medium">
        {text}
      </Text>
      {icon}
    </Stack>
  </Box>
)

export default AccessText
