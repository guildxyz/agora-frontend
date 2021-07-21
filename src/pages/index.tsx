import { Stack } from "@chakra-ui/react"
import CategorySection from "components/allCommunities/CategorySection"
import CommunityCard from "components/allCommunities/CommunityCard"
import { CommunityProvider } from "components/community/Context"
import Layout from "components/Layout"
import { GetStaticProps } from "next"
import { useRef } from "react"
import type { Community } from "temporaryData/communities"
import { communities as communitiesJSON } from "temporaryData/communities"

type Props = {
  communities: Community[]
}

const AllCommunities = ({ communities }: Props): JSX.Element => {
  /*
    The community cards are wrapped in chakra Portals, which are getting one of these refs as a containerRef.
    This causes the card to be inserted as a child of the element with the given ref.
      (this only happens in the DOM, and doesn't change the ref itself, causing problems with detecting the change)
    These three refs are being forwarded to the SimpleGrid components, so the communities will be inserted there.
    By default every card would go to the "Other communities" section,
      this is overridden if the user has access to, or is member of the community.
    This method is needed so we can threat every community individually, meaning we can use our existing useLevelAccess hook
      to decide if the user has access to the community.
  */
  const refYours = useRef<HTMLDivElement>(null)
  const refAccess = useRef<HTMLDivElement>(null)
  const refOther = useRef<HTMLDivElement>(null)

  return (
    <Layout
      title="All communities on Agora"
      bg="linear-gradient(white 0px, var(--chakra-colors-gray-100) 700px)"
    >
      <>
        <Stack spacing={8}>
          <CategorySection
            title="Your communities"
            placeholder={"You're not part of any communities yet"}
            ref={refYours}
          />
          <CategorySection
            title="Communities you have access to"
            placeholder={"You don't have access to any communities"}
            ref={refAccess}
          />
          <CategorySection
            title="Other communities"
            placeholder={"There aren't any other communities"}
            ref={refOther}
          />
        </Stack>
        {communities.map((community) => (
          // Wrapping in CommunityProvider, so we can use useCommunity, and existing hooks, that use useCommunity
          <CommunityProvider data={community} key={community.id}>
            <CommunityCard
              {...{
                refYours,
                refOther,
                refAccess,
              }}
            />
          </CommunityProvider>
        ))}
      </>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { communities: communitiesJSON },
})

export default AllCommunities
