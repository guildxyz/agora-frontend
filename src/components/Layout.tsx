import {
  useColorMode,
  FormControl,
  FormLabel,
  Switch,
  Box,
  Container,
  Heading,
  Stack,
  HStack,
} from "@chakra-ui/react"
import Head from "next/head"
import Account from "components/web3Connection/Account"

type Props = {
  title: string
  bg?: string
  bgColor?: string
  bgGradient?: string
  bgBlendMode?: string
  children: JSX.Element
}

const Layout = ({
  title,
  bg = "white",
  bgColor,
  bgGradient,
  bgBlendMode,
  children,
}: Props): JSX.Element => {
  const { colorMode, setColorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Box
        bg={bg}
        bgColor={bgColor}
        bgGradient={bgGradient}
        bgBlendMode={bgBlendMode}
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
              color={colorMode === "light" ? "gray.800" : "white"}
            >
              {title}
            </Heading>
            <HStack justify="space-between">
              <FormControl
                display="flex"
                flexDirection={{ base: "column", sm: "row", md: "column" }}
                alignItems="center"
                justifyContent={{ base: "center", sm: "flex-start", md: "center" }}
                width="max-content"
              >
                <Switch
                  size="sm"
                  id="color-mode"
                  colorScheme="primary"
                  isChecked={colorMode === "dark"}
                  onChange={(e) => setColorMode(e.target.checked ? "dark" : "light")}
                ></Switch>
                <FormLabel
                  m="0"
                  ml={{ base: 0, sm: 2 }}
                  width="max-content"
                  htmlFor="color-mode"
                  color={colorMode === "light" ? "gray.800" : "white"}
                  textAlign="center"
                  fontSize="xs"
                >
                  Dark mode
                </FormLabel>
              </FormControl>
              <Account />
            </HStack>
          </Stack>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
