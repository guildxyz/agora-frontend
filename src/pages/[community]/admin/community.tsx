import { Box, Button, Spinner, Stack, useColorMode, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import fetchCommunityData from "components/admin/utils/fetchCommunityData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AdminCommunityPage = (): JSX.Element => {
  const [communityData, setCommunityData] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { chainId, account } = useWeb3React()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData?.themeColor || "#71717a"
  )
  const { colorMode } = useColorMode()

  const methods = useForm({ mode: "all" })

  const onSubmit = useSubmitLevelsData(
    setLoading,
    communityData?.levels?.length > 0 ? "PATCH" : "POST",
    communityData?.id,
    // Refetch when the level data is updated in the DB
    () =>
      fetchCommunityData(router.query.community.toString()).then(
        (newCommunityData) => setCommunityData(newCommunityData)
      )
  )

  // Helper method for converting ms to month(s)
  const convertMsToMonths = (ms: number) => {
    if (!ms) return undefined

    return Math.round(ms * 3.8026486208174e-10)
  }

  // Fetch the communityData when we have the necessary info for it
  useEffect(() => {
    if (router.query.community && !communityData) {
      fetchCommunityData(router.query.community.toString()).then(
        (newCommunityData) => {
          if (!newCommunityData) {
            router.push("/404")
            return
          }
          setCommunityData(newCommunityData)
        }
      )
    }
  }, [router.query, chainId])

  // Set up the default form field values if we have the necessary data
  useEffect(() => {
    if (communityData) {
      const discordServer =
        communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "DISCORD") || undefined

      methods.setValue(
        "tokenSymbol",
        communityData.chainData?.length > 0
          ? communityData.chainData[0].token?.symbol
          : undefined
      )
      methods.setValue(
        "isTGEnabled",
        !!communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "TELEGRAM")
      )
      methods.setValue("isDCEnabled", !!discordServer)
      methods.setValue("discordServerId", discordServer?.platformId || undefined)
      methods.setValue("inviteChannel", discordServer?.inviteChannel || undefined)
      methods.setValue(
        "levels",
        communityData.levels.map((level) => ({
          id: level.id,
          name: level.name || undefined,
          image: level.imageUrl || undefined,
          description: level.description || undefined,
          requirementType: level.requirementType,
          requirement: level.requirement || undefined,
          stakeTimelockMs: convertMsToMonths(level.stakeTimelockMs),
          telegramGroupId: level.telegramGroupId || undefined,
        }))
      )
    }
  }, [communityData])

  // Redirect the user if they aren't the community owner
  useEffect(() => {
    if (
      communityData &&
      account &&
      account.toLowerCase() !== communityData.owner?.address
    ) {
      router.push(`/${communityData.urlName}`)
    }
  }, [account])

  // If the user isn't logged in, display an error message
  if (!chainId) {
    return (
      <NotConnectedError
        title={communityData ? `${communityData.name} - Levels` : "Loading..."}
      />
    )
  }

  // If we haven't fetched the community data / form data yet, display a spinner, otherwise render the admin page
  return (
    <>
      {!communityData || !methods ? (
        <Box sx={generatedColors}>
          <VStack pt={16} justifyItems="center">
            <Spinner size="xl" />
          </VStack>
        </Box>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FormProvider {...methods}>
              <Box sx={generatedColors}>
                <Layout
                  title={`${communityData.name} - Levels`}
                  imageUrl={communityData.imageUrl}
                >
                  {account &&
                    account.toLowerCase() === communityData.owner?.address && (
                      <Stack spacing={{ base: 7, xl: 9 }}>
                        <Pagination isAdminPage />
                        <VStack pb={{ base: 16, xl: 0 }} spacing={12}>
                          <Platforms
                            activePlatforms={communityData.communityPlatforms.filter(
                              (platform) => platform.active
                            )}
                          />
                          <Levels />

                          <Box
                            position="fixed"
                            bottom={{ base: 0, xl: 4 }}
                            right={{
                              base: 0,
                              xl: "calc((100vw - var(--chakra-sizes-container-lg)) / 2)",
                            }}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            py={{ base: 4, xl: 0 }}
                            width={{ base: "full", xl: "max-content" }}
                            background={colorMode === "light" ? "white" : "gray.700"}
                            borderTop="1px"
                            borderTopColor={
                              colorMode === "light" ? "gray.200" : "gray.600"
                            }
                            transform={{ base: "none", xl: "translateX(100%)" }}
                            zIndex="docked"
                          >
                            <Button
                              colorScheme="primary"
                              onClick={methods.handleSubmit(onSubmit)}
                              isLoading={loading}
                            >
                              {communityData.levels?.length > 0
                                ? "Update levels"
                                : "Create levels"}
                            </Button>
                          </Box>
                        </VStack>
                      </Stack>
                    )}
                </Layout>
              </Box>
            </FormProvider>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}

export default AdminCommunityPage
