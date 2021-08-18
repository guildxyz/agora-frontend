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
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Community } from "temporaryData/types"

type Props = {
  communityData: Community
}

const AdminHomePage = ({ communityData }: Props): JSX.Element => {
  const router = useRouter()
  const { chainId, account } = useWeb3React()
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

  const onSubmit = useSubmitCommunityData("PATCH", communityData.id)

  useEffect(() => {
    if (account && account.toLowerCase() !== communityData.owner?.address) {
      router.push(`/${communityData.urlName}`)
    }
  }, [account])

  if (!chainId) {
    return <NotConnectedError title={`${communityData.name} - General`} />
  }

  return (
    <FormProvider {...methods}>
      <Box sx={generatedColors}>
        <Layout
          title={`${communityData.name} - General`}
          imageUrl={communityData.imageUrl}
        >
          {account && account.toLowerCase() === communityData.owner?.address && (
            <Stack spacing={{ base: 7, xl: 9 }}>
              <Pagination
                isAdmin={
                  account && account.toLowerCase() === communityData.owner?.address
                }
              />
              <VStack spacing={12}>
                <Details isAdminPage />
                <UsedToken />
                <Appearance
                  onColorChange={(newColor: string) => setColorCode(newColor)}
                />
                <Button
                  onClick={methods.handleSubmit(onSubmit)}
                  colorScheme="primary"
                >
                  Update community
                </Button>
              </VStack>
            </Stack>
          )}
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
