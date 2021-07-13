import { Stack } from "@chakra-ui/react"
import CategorySection from "components/allCommunities/CategorySection"
import useCategorizedCommunities from "components/allCommunities/hooks/useCategorizedCommunities"
import Layout from "components/Layout"
import { GetStaticProps } from "next"
import type { Community } from "temporaryData/communities"
import { communities as communitiesJSON } from "temporaryData/communities"

type Props = {
  communities: Community[]
}

const AllCommunities = ({ communities }: Props): JSX.Element => {
  const {
    categories: { joined, hasAccess, other },
    areCategoriesLoading,
  } = useCategorizedCommunities(communities)

  return (
    <Layout
      title="All communities on Agora"
      bg="linear-gradient(white 0px, var(--chakra-colors-gray-100) 700px)"
    >
      <Stack spacing={8}>
        <CategorySection
          title="Your communities"
          communities={joined}
          placeholder={
            areCategoriesLoading
              ? "[loading...]"
              : "You're not part of any communities yet"
          }
        />
        <CategorySection
          title="Communities you have access to"
          communities={hasAccess}
          placeholder={
            areCategoriesLoading
              ? "[loading...]"
              : "You don't have access to any communities"
          }
        />
        <CategorySection
          title="Other communities"
          communities={other}
          placeholder={
            areCategoriesLoading
              ? "[loading...]"
              : "There aren't any other communities"
          }
        />
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { communities: communitiesJSON },
})

export default AllCommunities
