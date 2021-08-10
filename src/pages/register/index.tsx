import { Box, Stack, VStack } from "@chakra-ui/react"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import UsedToken from "components/admin/index/UsedToken"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import React, { useState } from "react"

const Page = (): JSX.Element => {
  const [colorCode, setColorCode] = useState<string>(null)
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )

  return (
    <Box sx={{ ...generatedColors, transition: "0.5s ease" }}>
      <Layout title="Integrate token">
        <Stack spacing={{ base: 7, xl: 9 }}>
          <Pagination />
          <VStack spacing={12}>
            <Details />
            <UsedToken />
            <Appearance
              onColorChange={(newColor: string) => setColorCode(newColor)}
            />
          </VStack>
        </Stack>
      </Layout>
    </Box>
  )
}

export default Page
