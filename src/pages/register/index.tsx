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
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import UsedToken from "components/admin/index/UsedToken"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { Chains, RPC } from "connectors"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const { chainId } = useWeb3React()

  const [colorCode, setColorCode] = useState<string>(null)

  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )

  const methods = useForm({ mode: "all" })

  /** TODO: tokenAddress??? contractAddress??? */
  const onSubmit = (data) => {
    console.log({
      ...data,
      chainName: chainId ? RPC[Chains[chainId]].chainName.toUpperCase() : null,
    })
  }

  if (!chainId) {
    return (
      <Box>
        <Layout title="Integrate token">
          <Alert status="error" mb="6">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1}>
                Please connect your wallet in order to continue!
              </AlertDescription>
            </Stack>
          </Alert>
        </Layout>
      </Box>
    )
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
              <Button onClick={methods.handleSubmit(onSubmit)}>
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
