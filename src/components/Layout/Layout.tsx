import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Account from "components/web3Connection/Account"
import Head from "next/head"
import ColorModeSwitch from "./components/ColorModeSwitch"

type Props = {
  title: string
  children: JSX.Element
}

const Layout = ({ title, children }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Box
        bgColor={
          colorMode === "light" ? "gray.100" : "var(--chakra-colors-gray-800)"
        }
        bgGradient={`linear(${
          colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
        } 0px, var(--chakra-colors-primary-100) 700px)`}
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
      >
        <Container
          maxW="container.lg"
          py={{ base: 4, md: 12, lg: 24 }}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          <Stack
            direction={{ base: "column-reverse", md: "row" }}
            spacing={8}
            justify="space-between"
            pb={{ base: 8, md: 16 }}
          >
            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontFamily="display"
            >
              {title}
            </Heading>
            <HStack justify="flex-end">
              <Card>
                <ColorModeSwitch />
              </Card>
              <Card>
                <Account />
              </Card>
            </HStack>
          </Stack>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
