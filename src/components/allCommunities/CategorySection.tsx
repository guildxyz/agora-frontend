import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { MutableRefObject, forwardRef } from "react"

type Props = {
  title: string
  placeholder?: string
  showPlaceholder: boolean
}

const CategorySection = forwardRef(
  (
    { title, placeholder, showPlaceholder }: Props,
    ref: MutableRefObject<HTMLDivElement>
  ) => (
    <Stack spacing={4}>
      <Heading size="md" as="h4">
        {title}
      </Heading>

      <SimpleGrid ref={ref} columns={{ base: 1, lg: 2 }} spacing={10} />

      {showPlaceholder && <Text>{placeholder}</Text>}
    </Stack>
  )
)

export default CategorySection
