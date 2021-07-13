import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import CommunityCard from "components/allCommunities/CommunityCard"
import { Community } from "temporaryData/types"

type Props = {
  title: string
  communities: Community[]
  placeholder?: string
}

const CategorySection = ({
  title,
  communities,
  placeholder,
}: Props): JSX.Element => (
  <Stack spacing={4}>
    <Heading size="md" as="h4">
      {title}
    </Heading>

    {communities.length ? (
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        {communities.map((i) => (
          <CommunityCard community={i} key={i.id} />
        ))}
      </SimpleGrid>
    ) : (
      <Text>{placeholder}</Text>
    )}
  </Stack>
)

export default CategorySection
