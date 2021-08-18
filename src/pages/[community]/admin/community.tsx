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
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Community } from "temporaryData/types"

type Props = {
  communityData: Community
}

const AdminCommunityPage = ({ communityData }: Props): JSX.Element => {
  console.log(communityData)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { chainId, account } = useWeb3React()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData.themeColor || "#71717a"
  )
  const methods = useForm({
    mode: "all",
    defaultValues: {
      isTGEnabled: !!communityData.communityPlatforms
        .filter((platform) => platform.active)
        .find((platform) => platform.name === "TELEGRAM"),
      isDCEnabled: !!communityData.communityPlatforms
        .filter((platform) => platform.active)
        .find((platform) => platform.name === "DISCORD"),
      discordServerId:
        communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "DISCORD")?.platformId || undefined,
      levels: communityData.levels.map((level) => ({
        id: level.id,
        name: level.name || undefined,
        image: level.imageUrl || undefined,
        description: level.description || undefined,
        requirementType: level.requirementType,
        requirement: level.requirement || undefined,
        stakeTimelockMs: level.stakeTimelockMs || undefined, // TODO: convert it to months
        telegramGroupId: level.telegramGroupId || undefined,
      })),
    },
  })

  const onSubmit = useSubmitLevelsData(
    setLoading,
    communityData.levels?.length > 0 ? "PATCH" : "POST",
    communityData.id
  )

  useEffect(() => {
    if (account && account.toLowerCase() !== communityData.owner?.address) {
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
          {account && account.toLowerCase() === communityData.owner?.address && (
            <Stack spacing={{ base: 7, xl: 9 }}>
              <Pagination
                isAdmin={
                  account && account.toLowerCase() === communityData.owner?.address
                }
              />
              <VStack spacing={12}>
                <Platforms
                  activePlatforms={communityData.communityPlatforms.filter(
                    (platform) => platform.active
                  )}
                />
                <Levels />

                <Button
                  colorScheme="primary"
                  onClick={methods.handleSubmit(onSubmit)}
                  isLoading={loading}
                >
                  {communityData.levels?.length > 0
                    ? "Update levels"
                    : "Create levels"}
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
