import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Stack,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useSubmitCommunityData from "components/admin/hooks/useSubmitCommunityData"
import useUploadImages from "components/admin/hooks/useUploadImages"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import getServerSideProps from "components/admin/utils/setCookies"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const { active } = useWeb3React()
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
      image: null,
    },
  })

  const { onSubmit: uploadImages, loading: uploadLoading } = useUploadImages("POST")

  const {
    onSubmit: onRegister,
    loading: registerLoading,
    success: registerSuccess,
  } = useSubmitCommunityData(
    "POST",
    methods.getValues().image ? methods.handleSubmit(uploadImages) : undefined
  )

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <FormProvider {...methods}>
      <Box sx={generatedColors}>
        <Layout title="Integrate token">
          {active ? (
            <Stack spacing={{ base: 7, xl: 9 }}>
              <Pagination isRegister>
                <Button
                  isLoading={registerLoading || uploadLoading}
                  colorScheme="primary"
                  onClick={methods.handleSubmit(
                    registerSuccess ? uploadImages : onRegister
                  )}
                >
                  Save
                </Button>
              </Pagination>
              <VStack spacing={12}>
                <Details registerSuccess={registerSuccess} />
                <Appearance
                  onColorChange={(newColor: string) => setColorCode(newColor)}
                />
              </VStack>
            </Stack>
          ) : (
            <Alert status="error" mb="6">
              <AlertIcon />
              <Stack>
                <AlertDescription position="relative" top={1}>
                  Please connect your wallet in order to continue!
                </AlertDescription>
              </Stack>
            </Alert>
          )}
        </Layout>
      </Box>
    </FormProvider>
  )
}

export { getServerSideProps }
export default Page
