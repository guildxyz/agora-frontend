import { Heading, Stack, Box } from "@chakra-ui/react"

type Props = {
  title: string
  children: JSX.Element
}

const CategorySection = ({ title, children }: Props): JSX.Element => (
  <Stack px={{ base: 4, sm: 0 }} spacing={4}>
    <Heading fontSize={{ base: "sm", sm: "md" }} as="h4">
      {title}
    </Heading>
    <Box>{children}</Box>
  </Stack>
)

export default CategorySection
