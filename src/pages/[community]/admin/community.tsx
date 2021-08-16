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
import clearUndefinedData from "components/admin/utils/clearUndefinedData"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Community } from "temporaryData/types"

type Props = {
  communityData: Community
}

// Helper method for converting month(s) to ms
const convertMonthsToMs = (months: number) =>
  Math.round(months / 3.8026486208174e-10)

const AdminCommunityPage = ({ communityData }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const methods = useForm({ mode: "all" })

  const onSubmit = (data) => {
    const editedData = { ...data }

    // Won't send these to the backend
    delete editedData.isDCEnabled
    delete editedData.isTGEnabled

    // Converting timeLock to ms for every level
    editedData.levels = editedData.levels?.map((level) => {
      const timeLock = level.stakeTimelockMs

      if (!timeLock) {
        return clearUndefinedData(level)
      }

      return {
        ...clearUndefinedData(level),
        stakeTimelockMs: convertMonthsToMs(timeLock),
      }
    })

    const finalData = clearUndefinedData(editedData)

    // TODO...
    console.log(
      `Sending request to: ${process.env.NEXT_PUBLIC_API}/community/${communityData.id}\nPayload:`,
      finalData
    )
  }

  if (!chainId) {
    return (
      <Box>
        <Layout title="Integrate token" imageUrl={communityData.imageUrl}>
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
      <Layout title="Integrate token" imageUrl={communityData.imageUrl}>
        <Stack spacing={{ base: 7, xl: 9 }}>
          <Pagination isAdminPage />
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

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default AdminCommunityPage
