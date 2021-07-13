import { Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CategorySection from "components/allCommunities/CategorySection"
import useCategorizeCommunities from "components/allCommunities/hooks/useCategorizeCommunities"
import Layout from "components/Layout"
import { GetStaticProps } from "next"
import { useMemo } from "react"
import type { Community } from "temporaryData/communities"
import { communities as communitiesJSON } from "temporaryData/communities"

type Props = {
  communities: Community[]
}

const AllCommunities = ({ communities }: Props): JSX.Element => {
  const {
    categories: { joined, hasAccess, other },
    areCategoriesLoading,
  } = useCategorizeCommunities(communities)
  const { account, library } = useWeb3React()

  const isConnected = typeof account === "string" && !!library

  const defaultPlaceholder = useMemo(() => {
    if (!isConnected) return "Wallet not connected"
    if (areCategoriesLoading) return "[loading...]"
    return null
  }, [isConnected, areCategoriesLoading])

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
            defaultPlaceholder ?? "You're not part of any communities yet"
          }
        />
        <CategorySection
          title="Communities you have access to"
          communities={hasAccess}
          placeholder={
            defaultPlaceholder ?? "You don't have access to any communities"
          }
        />
        <CategorySection
          title="Other communities"
          communities={other}
          placeholder={defaultPlaceholder ?? "There aren't any other communities"}
        />
      </Stack>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { communities: communitiesJSON },
})

export default AllCommunities
