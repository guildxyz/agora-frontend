import { Icon, Stack, Text, useToast } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import ActionCard from "components/[community]/common/ActionCard"
import { CommunityProvider } from "components/[community]/common/Context"
import Pagination from "components/[community]/common/Pagination"
import { Info } from "phosphor-react"
import { useEffect } from "react"
import type { Community } from "temporaryData/communities"

type Props = {
  communityData: Community
  preview: boolean
}

const CommunityPage = ({ communityData, preview }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const toast = useToast()

  useEffect(() => {
    if (preview)
      toast({
        title: "Preview mode.",
        description:
          "This site is currently in preview mode. This community has just been updated. The changes should go live in about 5-10 minutes.",
        status: "info",
        duration: 10_000,
        isClosable: true,
      })
  }, [])

  return (
    <CommunityProvider data={communityData}>
      <Layout
        title={communityData.name}
        imageUrl={communityData.imageUrl}
        editBtnUrl={
          account?.toLowerCase() === communityData.owner?.address &&
          `/${communityData.urlName}/admin`
        }
      >
        <Stack spacing={{ base: 7, xl: 9 }}>
          <Pagination />
          <Stack spacing={{ base: 7 }}>
            <ActionCard
              title="About"
              description={communityData.description || "No description"}
            />
            <Card p="6" isFullWidthOnMobile>
              <Text
                fontWeight="medium"
                colorScheme="gray"
                display="flex"
                alignItems="center"
              >
                <Icon as={Info} mr="2" />
                More info coming soon
              </Text>
            </Card>
          </Stack>
        </Stack>
      </Layout>
    </CommunityProvider>
  )
}

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default CommunityPage
