import { Box, Container, Heading, HStack } from "@chakra-ui/react"
import Head from "next/head"
import Account from "components/web3Connection/Account"
import { useContext } from "react"
import { CommunityContext } from "./community/Context"

type Props = {
  title?: string
  bg?: string
  children: JSX.Element
}

const makeTitle = (name: string) => `${name} community`

const Layout = ({ title = "", bg = "white", children }: Props): JSX.Element => {
  const communityData = useContext(CommunityContext)

  return (
    <>
      <Head>
        <title>{title || makeTitle(communityData.name)}</title>
        <meta property="og:title" content={title || makeTitle(communityData.name)} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Box bg={bg} minHeight="100vh">
        <Container maxW="container.lg" py={24} px={10}>
          <HStack justify="space-between" align="center" pb={16}>
            <Heading size="2xl" fontFamily="display">
              {title || makeTitle(communityData.name)}
            </Heading>
            <Account />
          </HStack>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
