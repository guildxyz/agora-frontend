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
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const methods = useForm({ mode: "all" })

  const onSubmit = (data) => {
    console.log(data)
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
      <Layout title="Integrate token">
        <Stack spacing={{ base: 7, xl: 9 }}>
          <Pagination />
          <VStack spacing={12}>
            <Platforms />
            <Levels />

            <Button onClick={methods.handleSubmit(onSubmit)}>Submit</Button>
          </VStack>
        </Stack>
      </Layout>
    </FormProvider>
  )
}

export default Page
