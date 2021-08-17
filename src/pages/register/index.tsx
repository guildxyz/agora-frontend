import { Box, Button, Stack, useToast, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import UsedToken from "components/admin/index/UsedToken"
import clearUndefinedData from "components/admin/utils/clearUndefinedData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const router = useRouter()
  const toast = useToast()

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

  const sign = usePersonalSign()

  const onSubmit = (data) => {
    sign("Please sign this message to verify your address")
      .then((addressSignedMessage) => {
        const finalData = clearUndefinedData(data)
        fetch(`${process.env.NEXT_PUBLIC_API}/community`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...finalData, addressSignedMessage }),
        })
          .then((response) => {
            if (response.status !== 201) {
              toast({
                title: "Error",
                description: "An error occurred while creating your community",
                status: "error",
                duration: 4000,
              })
              return
            }

            toast({
              title: "Success!",
              description:
                "Community added! You'll be redirected to the admin page.",
              status: "success",
              duration: 2000,
            })

            setTimeout(() => {
              router.push(`/${finalData.urlName}/admin/community`)
            }, 2000)
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Server error",
              status: "error",
              duration: 4000,
            })
          })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "You must sign the message to verify your address!",
          status: "error",
          duration: 4000,
        })
      })
  }

  if (!chainId) {
    return <NotConnectedError title="Integrate token" />
  }

  return (
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
  )
}

export default Page
