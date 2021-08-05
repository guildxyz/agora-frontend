import { Box, Container, Grid, GridItem } from "@chakra-ui/react"
import Head from "next/head"
import Header from "./components/Header"
import SideNav from "./components/SideNav"

type Props = {
  title: string
  children: JSX.Element
}

const AdminLayout = ({ title, children }: Props): JSX.Element => (
  <>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {/* <link rel="icon" href="/favicon.ico" /> */}
    </Head>
    <Box bgColor="gray.100" minHeight="100vh">
      <Header />
      <Container maxW="container.lg" py={16} px={{ base: 4, sm: 6, md: 8, lg: 10 }}>
        <Grid templateColumns="repeat(4, 1fr)" gap={16}>
          <GridItem as="aside" colSpan={1}>
            <SideNav />
          </GridItem>
          <GridItem colSpan={3}>{children}</GridItem>
        </Grid>
      </Container>
    </Box>
  </>
)

export default AdminLayout
