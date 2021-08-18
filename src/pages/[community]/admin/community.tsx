import { Box, Button, HStack, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useSpaceFactory from "components/admin/hooks/useSpaceFactory"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { Chains } from "connectors"
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
      isTGEnabled: !!communityData.communityPlatforms
        .filter((platform) => platform.active)
        .find((platform) => platform.name === "TELEGRAM"),
      isDCEnabled: !!communityData.communityPlatforms
        .filter((platform) => platform.active)
        .find((platform) => platform.name === "DISCORD"),
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

  const levels = methods.watch("levels")
  const hasStakeLevel = levels.some((level) => level.requirementType === "STAKE")

  const currentChainData = communityData.chainData.find(
    (chain) => chain.name === Chains[chainId]
  )

  const { createSpace, contractAddress, mutateContractAddress, stakeToken } =
    useSpaceFactory(currentChainData?.token.address)

  const isOnCorrectChain =
    true || communityData.chainData.some((chain) => chain.name === Chains[chainId])

  const onSubmit = useSubmitLevelsData(
    communityData.levels?.length > 0 ? "PATCH" : "POST",
    communityData.id
  )

  const isSpaceCreated =
    contractAddress !== "0x0000000000000000000000000000000000000000"

  useEffect(() => console.log(stakeToken), [stakeToken])

  /* useEffect(() => {
    if (account && account.toLowerCase() !== communityData.owner?.address) {
      router.push(`/${communityData.urlName}`)
    }
  }, [account]) */

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
          {account && isOnCorrectChain && (
            /* account.toLowerCase() === communityData.owner?.address && */ <Stack
              spacing={{ base: 7, xl: 9 }}
            >
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

                <HStack>
                  {hasStakeLevel && !isSpaceCreated && (
                    <Button
                      colorScheme="primary"
                      onClick={async () => {
                        const tx = await createSpace(currentChainData?.token.address)
                        await tx.wait()
                        mutateContractAddress()
                      }}
                    >
                      Deploy contract
                    </Button>
                  )}

                  <Button
                    disabled={hasStakeLevel && !isSpaceCreated}
                    colorScheme="primary"
                    onClick={methods.handleSubmit(onSubmit)}
                  >
                    {communityData.levels?.length > 0
                      ? "Update levels"
                      : "Create levels"}
                  </Button>
                </HStack>
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
