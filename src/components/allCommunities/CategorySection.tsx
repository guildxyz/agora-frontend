import { useColorMode, Heading, Stack, Box } from "@chakra-ui/react"

type Props = {
  title: string
  children: JSX.Element
}

const CategorySection = ({ title, children }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Stack spacing={4} color={colorMode === "light" ? "gray.800" : "white"}>
      <Heading fontSize={{ base: "md", sm: "lg" }} as="h4">
        {title}
      </Heading>
      <Box>{children}</Box>
    </Stack>
  )
}

export default CategorySection
