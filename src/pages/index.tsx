import { Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CategorySection from "components/allCommunities/CategorySection"
import CommunityCard from "components/allCommunities/CommunityCard"
import useCategorizeCommunities from "components/allCommunities/hooks/useCategorizeCommunities"
import { CommunityProvider } from "components/community/Context"
import Layout from "components/Layout"
import { GetStaticProps } from "next"
import { useEffect, useMemo, useRef } from "react"
import type { Community } from "temporaryData/communities"
import { communities as communitiesJSON } from "temporaryData/communities"

type Props = {
  communities: Community[]
}

const AllCommunities = ({ communities }: Props): JSX.Element => {
  const { account, library } = useWeb3React()
  const refYours = useRef<HTMLDivElement>(null)
  const refAccess = useRef<HTMLDivElement>(null)
  const refOther = useRef<HTMLDivElement>(null)

  const isConnected = typeof account === "string" && !!library

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
            ref={(node) => {
              console.log(node)
              refAccess.current = node
              return node
            }}
          />
          <CategorySection
            title="Other communities"
            placeholder={"There aren't any other communities"}
            ref={refOther}
          />
        </Stack>
        {communities.map((community) => (
          <CommunityProvider data={community} key={community.id}>
            <CommunityCard {...{ refYours, refOther, refAccess }} />
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
