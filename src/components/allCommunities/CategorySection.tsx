import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import CommunityCard from "components/allCommunities/CommunityCard"
import { MutableRefObject, useEffect, useMemo, forwardRef } from "react"
import { Community } from "temporaryData/types"
import { UrlWithStringQuery } from "url"

type Props = {
  title: string
  placeholder?: string
}

const CategorySection = forwardRef(
  ({ title, placeholder }: Props, ref: MutableRefObject<HTMLDivElement>) => (
    <Stack spacing={4}>
      <Heading size="md" as="h4">
        {title}
      </Heading>
      <SimpleGrid ref={ref} columns={{ base: 1, lg: 2 }} spacing={10} />

      {/* TODO fix this */}
      {!ref.current?.children.length && <Text>{placeholder}</Text>}
    </Stack>
  )
)

export default CategorySection
