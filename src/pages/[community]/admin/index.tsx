import { Box, Button, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import useSubmitCommunityData from "components/admin/hooks/useSubmitCommunityData"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import UsedToken from "components/admin/index/UsedToken"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Community } from "temporaryData/types"

type Props = {
  communityData: Community
}

const AdminHomePage = ({ communityData }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const [colorCode, setColorCode] = useState<string>(null)
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )
  const methods = useForm({
    mode: "all",
    defaultValues: {
      name: communityData.name,
      urlName: communityData.urlName,
      description: communityData.description,
      chainName: communityData.chainData[0].name, // Maybe we'll need to think about this one, because currently we're displaying the active chain's name inside the form!
      themeColor: communityData.themeColor,
      tokenAddress: communityData.chainData[0].token.address,
    },
  })

  const onSubmit = useSubmitCommunityData("PATCH")

  if (!chainId) {
    return <NotConnectedError title={`${communityData.name} - General`} />
  }

  return (
    <FormProvider {...methods}>
      <Box sx={generatedColors}>
        <Layout title="Integrate token">
          <Stack spacing={{ base: 7, xl: 9 }}>
            <Pagination isAdminPage />
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

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default AdminHomePage
