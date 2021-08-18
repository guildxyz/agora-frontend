import { Box, Button, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Community } from "temporaryData/types"

type Props = {
  communityData: Community
}

const AdminCommunityPage = ({ communityData }: Props): JSX.Element => {
  const router = useRouter()
  const { chainId, account } = useWeb3React()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData.themeColor || "#71717a"
  )
  const methods = useForm({
    mode: "all",
    defaultValues: {
      levels: communityData.levels.map((level) => ({
        id: level.id,
        name: level.name,
        image: level.imageUrl,
        description: level.description,
        requirementType: level.requirementType,
        requirement: level.requirement,
        stakeTimelockMs: level.stakeTimelockMs, // TODO: convert it to months
        telegramGroupId: level.telegramGroupId,
      })),
    },
  })

  const onSubmit = useSubmitLevelsData(
    communityData.levels?.length > 0 ? "PATCH" : "POST",
    communityData.id
  )

  useEffect(() => {
    if (account && account.toLowerCase() !== communityData.owner.address) {
      router.push(`/${communityData.urlName}`)
    }
  }, [account])

  if (!chainId) {
    return <NotConnectedError title={`${communityData.name} - Levels`} />
  }

  return (
    <FormProvider {...methods}>
      <Box sx={generatedColors}>
        <Layout
          title={`${communityData.name} - Levels`}
          imageUrl={communityData.imageUrl}
        >
          {account && account.toLowerCase() === communityData.owner.address && (
            <Stack spacing={{ base: 7, xl: 9 }}>
              <Pagination isAdminPage />
              <VStack spacing={12}>
                <Platforms />
                <Levels />

                <Button
                  colorScheme="primary"
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  Submit
                </Button>
              </VStack>
            </Stack>
          )}
        </Layout>
      </Box>
    </FormProvider>
  )
}

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default AdminCommunityPage
