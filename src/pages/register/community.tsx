import { Stack, VStack } from "@chakra-ui/react"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import React from "react"

const Page = (): JSX.Element => (
  <Layout title="Integrate token">
    <Stack spacing={{ base: 7, xl: 9 }}>
      <Pagination />
      <VStack spacing={12}>
        <Platforms />
        <Levels />
      </VStack>
    </Stack>
  </Layout>
)

export default Page
