import { Box, Spinner, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import useSubmitCommunityData from "components/admin/hooks/useSubmitCommunityData"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import UsedToken from "components/admin/index/UsedToken"
import fetchCommunityData from "components/admin/utils/fetchCommunityData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AdminHomePage = (): JSX.Element => {
  const [communityData, setCommunityData] = useState(null)
  const router = useRouter()
  const { chainId, account } = useWeb3React()
  const [colorCode, setColorCode] = useState<string>(null)
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )

  const methods = useForm({ mode: "all" })

  const {onSubmit, loading} = useSubmitCommunityData("PATCH", communityData?.id)

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
      // Reset the form state so we can watch the "isDirty" prop
      methods.reset({
        name: communityData.name,
        urlName: communityData.urlName,
        description: communityData.description,
        chainName: communityData.chainData[0].name, // Maybe we'll need to think about this one, because currently we're displaying the active chain's name inside the form!
        themeColor: communityData.themeColor,
        tokenAddress: communityData.chainData[0].token.address,
      })
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
  }, [communityData, account])

  // If the user isn't logged in, display an error message
  if (!chainId) {
    return (
      <NotConnectedError
        title={communityData ? `${communityData.name} - General` : "Loading..."}
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
                  title={`${communityData.name} - General`}
                  imageUrl={communityData.imageUrl}
                >
                  {account &&
                    account.toLowerCase() === communityData.owner?.address && (
                      <Stack spacing={{ base: 7, xl: 9 }}>
                        <Pagination
                          isAdminPage
                          saveBtnLoading={loading}
                          onSaveClick={
                            methods.formState.isDirty &&
                            methods.handleSubmit(onSubmit)
                          }
                        />
                        <VStack spacing={12}>
                          <Details isAdminPage />
                          <UsedToken />
                          <Appearance
                            onColorChange={(newColor: string) =>
                              setColorCode(newColor)
                            }
                          />
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

export default AdminHomePage
