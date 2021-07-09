import { GetStaticProps, GetStaticPaths } from "next"
import { Center, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { Link } from "components/common/Link"
import Layout from "components/Layout"
import { communities } from "temporaryData/communities"
import type { Community } from "temporaryData/communities"
import Platforms from "components/community/Platforms"
import Staked from "components/community/Staked"
import Levels from "components/community/Levels"
import { CommunityProvider } from "components/community/Context"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => (
  <CommunityProvider data={communityData}>
    <Layout
      title={`${communityData.name} community`}
      bg="linear-gradient(white 0px, var(--chakra-colors-primary-50) 700px)"
    >
      <Stack spacing={{ base: 8, sm: 10 }}>
        <Text px={{ base: 4, sm: 0 }} fontWeight="medium">
          {communityData.description}
        </Text>
        <SimpleGrid
          templateColumns={{ base: "100%", md: "3fr 2fr" }}
          gap={{ base: 0, sm: 5, md: 10 }}
        >
          <Platforms />
          <Staked />
        </SimpleGrid>
        <Levels />
        {/* <pre>{JSON.stringify(communityData, undefined, 2)}</pre> */}
        <Link href="/" pt={2} textAlign={{ base: "center", sm: "left" }}>
          Back to all communities
        </Link>
      </Stack>
    </Layout>
  </CommunityProvider>
)

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const communityData = communities.find((i) => i.urlName === params.community)

  if (!communityData) {
    return {
      notFound: true,
    }
  }

  return {
    props: { communityData },
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = communities.map((i) => ({
    params: {
      community: i.urlName,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default CommunityPage
