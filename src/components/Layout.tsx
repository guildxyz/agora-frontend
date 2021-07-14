import {
  useColorMode,
  Switch,
  Icon,
  Box,
  Container,
  Heading,
  Stack,
  HStack,
} from "@chakra-ui/react"
import { Moon, Sun } from "phosphor-react"
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
            <HStack justify={{ base: "space-between", md: "flex-end" }}>
              <Switch
                position="relative"
                mt={1}
                size="lg"
                id="color-mode"
                colorScheme="primary"
                isChecked={colorMode === "light"}
                onChange={(e) => setColorMode(e.target.checked ? "light" : "dark")}
              >
                <Box
                  overflow="hidden"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="full"
                  height="full"
                  position="absolute"
                  top="-1px"
                  left={0}
                >
                  <Icon
                    as={Sun}
                    weight="fill"
                    color="white"
                    transform="translateX(-50%)"
                  />
                  <Icon
                    as={Moon}
                    weight="fill"
                    color="white"
                    transform="translateX(0)"
                  />
                </Box>
              </Switch>
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
