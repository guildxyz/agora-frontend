<<<<<<< HEAD
import { Box, Button, Stack, VStack } from "@chakra-ui/react"
=======
import { Box, Stack, VStack } from "@chakra-ui/react"
>>>>>>> main
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import useSubmitCommunityData from "components/admin/hooks/useSubmitCommunityData"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
<<<<<<< HEAD
import UsedToken from "components/admin/index/UsedToken"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
=======
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
>>>>>>> main
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const [colorCode, setColorCode] = useState<string>(null)
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )

  const methods = useForm({
    mode: "all",
    defaultValues: {
      name: "",
      urlName: "",
      description: "",
      chainName: "",
      themeColor: "",
      tokenAddress: "",
    },
  })

<<<<<<< HEAD
  const onSubmit = useSubmitCommunityData("POST")
=======
  const { onSubmit, loading } = useSubmitCommunityData("POST")

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )
>>>>>>> main

  if (!chainId) {
    return <NotConnectedError title="Integrate token" />
  }

  return (
<<<<<<< HEAD
    <FormProvider {...methods}>
      <Box sx={generatedColors}>
        <Layout title="Integrate token">
          <Stack spacing={{ base: 7, xl: 9 }}>
            <Pagination />
            <VStack spacing={12}>
              <Details />
              <UsedToken />
              <Appearance
                onColorChange={(newColor: string) => setColorCode(newColor)}
              />
              <Button onClick={methods.handleSubmit(onSubmit)} colorScheme="primary">
                Integrate token
              </Button>
            </VStack>
          </Stack>
        </Layout>
      </Box>
    </FormProvider>
=======
    <>
      <FormProvider {...methods}>
        <Box sx={generatedColors}>
          <Layout title="Integrate token">
            <Stack spacing={{ base: 7, xl: 9 }}>
              <Pagination
                isAdminPage
                isCommunityTabDisabled
                onSaveClick={methods.handleSubmit(onSubmit)}
                saveBtnLoading={loading}
              />
              <VStack spacing={12}>
                <Details />
                <Appearance
                  onColorChange={(newColor: string) => setColorCode(newColor)}
                />
              </VStack>
            </Stack>
          </Layout>
        </Box>
      </FormProvider>
    </>
>>>>>>> main
  )
}

export default Page
