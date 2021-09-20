import { Box, Button, Spinner, Stack, VStack } from "@chakra-ui/react"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useRedirectIfNotOwner from "components/admin/hooks/useRedirectIfNotOwner"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import useSubmitPlatformsData from "components/admin/hooks/useSubmitPlatformsData"
import useUploadImages from "components/admin/hooks/useUploadImages"
import getServerSideProps from "components/admin/utils/setCookies"
import Layout from "components/common/Layout"
import LinkButton from "components/common/LinkButton"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import Head from "next/head"
import React, { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AdminCommunityPage = (): JSX.Element => {
  const { communityData } = useCommunityData()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData?.themeColor || "#71717a"
  )
  const isOwner = useRedirectIfNotOwner()
  const methods = useForm({ mode: "all" })

  const [discordDirty, telegramDirty, levelsDirty, imageDirty] = useMemo(
    () => [
      ["isDCEnabled", "discordServerId", "inviteChannel"].some(
        (field) => typeof methods.formState.dirtyFields[field] !== "undefined"
      ),
      typeof methods.formState.dirtyFields.isTGEnabled !== "undefined",
      typeof methods.formState.dirtyFields.levels !== "undefined",
      methods.formState.dirtyFields.levels?.filter((level) => level.image)?.length >
        0,
    ],
    [methods.formState]
  )

  const HTTPMethod = communityData?.levels?.length > 0 ? "PATCH" : "POST"

  const { onSubmit: uploadImages, loading: uploadLoading } = useUploadImages(
    "PATCH",
    "community"
  )

  const { loading: levelsLoading, onSubmit: onLevelsSubmit } = useSubmitLevelsData(
    HTTPMethod,
    imageDirty ? methods.handleSubmit(uploadImages) : undefined
  )

  const { loading: platformsLoading, onSubmit: onPlatformsSubmit } =
    useSubmitPlatformsData(
      telegramDirty,
      discordDirty,
      levelsDirty ? methods.handleSubmit(onLevelsSubmit) : undefined
    )

  // Set up the default form field values if we have the necessary data
  useEffect(() => {
    if (communityData) {
      const discordServer = communityData.communityPlatforms.find(
        (platform) => platform.active && platform.name === "DISCORD"
      )

      // Reset the form state so we can watch the "isDirty" prop
      methods.reset({
        urlName: communityData.urlName, // We must define it, so the photo uploader can fetch the necessary community data
        tokenSymbol: communityData.chainData?.token.symbol,
        isTGEnabled: !!communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "TELEGRAM"),
        stakeToken: communityData.chainData.stakeToken,
        isDCEnabled: !!discordServer,
        discordServerId: discordServer?.platformId || undefined,
        inviteChannel: discordServer?.inviteChannel || undefined,
        levels: communityData.levels.map((level) => ({
          id: level.id,
          dbId: level.id, // Needed for proper form management
          name: level.name || undefined,
          imageUrl: level.imageUrl || undefined,
          description: level.description || undefined,
          requirements: level.requirements || undefined,
          telegramGroupId: level.telegramGroupId || undefined,
        })),
      })
    }
  }, [communityData])

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  // If we haven't fetched the community data / form data yet, display a spinner
  if (!isOwner || !methods)
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Box sx={generatedColors}>
          <VStack pt={16} justifyItems="center">
            <Spinner size="xl" />
          </VStack>
        </Box>
      </>
    )

  // Otherwise render the admin page
  return (
    <FormProvider {...methods}>
      <Box sx={generatedColors}>
        <Layout
          title={`${communityData?.name} - Settings`}
          imageUrl={communityData?.imageUrl}
        >
          <Stack spacing={{ base: 7, xl: 9 }}>
            <Pagination>
              {discordDirty || telegramDirty || levelsDirty ? (
                <Button
                  isLoading={levelsLoading || platformsLoading || uploadLoading}
                  colorScheme="primary"
                  onClick={methods.handleSubmit(
                    discordDirty || telegramDirty
                      ? onPlatformsSubmit
                      : onLevelsSubmit
                  )}
                >
                  Save
                </Button>
              ) : (
                <LinkButton
                  variant="solid"
                  href={`/${communityData?.urlName}/community`}
                >
                  Done
                </LinkButton>
              )}
            </Pagination>
            <VStack pb={{ base: 16, xl: 0 }} spacing={12}>
              <Platforms />
              <Levels />
            </VStack>
          </Stack>
        </Layout>
      </Box>
    </FormProvider>
  )
}

export { getServerSideProps }
export default AdminCommunityPage
