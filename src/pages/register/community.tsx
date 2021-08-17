import { Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const methods = useForm({ mode: "all" })

  if (!chainId) {
    return <NotConnectedError title="Integrate token" />
  }

  return (
    <FormProvider {...methods}>
      <Layout title="Integrate token">
        <Stack spacing={{ base: 7, xl: 9 }}>
          <Pagination />
          <VStack spacing={12}>
            <Platforms />
            <Levels />
          </VStack>
        </Stack>
      </Layout>
    </FormProvider>
  )
}

export default Page
