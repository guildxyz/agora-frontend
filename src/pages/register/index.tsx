import { Stack, VStack } from "@chakra-ui/react"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import UsedToken from "components/admin/index/UsedToken"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import React from "react"

const Page = (): JSX.Element => (
  <Layout title="Integrate token">
    <Stack spacing={{ base: 7, xl: 9 }}>
      <Pagination />
      <VStack spacing={12}>
        <Details />
        <UsedToken />
        <Appearance />
      </VStack>
    </Stack>
  </Layout>
)

export default Page
