import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  useColorMode,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import ColorModeSwitch from "components/common/Layout/components/ColorModeSwitch"
import Logo from "components/common/Layout/components/LogoWithMenu/components/Logo"
import Link from "components/common/Link"
import { useRouter } from "next/router"
import { Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type HeaderNavItem = {
  name: string
  path: string
}

export const headerNavItems: HeaderNavItem[] = [
  /*
  {
    name: "Settings",
    path: "/admin/general",
  },
  */
]

const Header = (): JSX.Element => {
  const { colorMode } = useColorMode()
  const router = useRouter()
  const { account } = useWeb3React()

  return (
    <Box
      as="header"
      bgColor={colorMode === "light" ? "white" : "gray.700"}
      boxShadow="base"
    >
      <Container maxW="container.xl" px={{ base: 4, sm: 6, md: 8, lg: 10 }}>
        <Grid templateColumns="repeat(5, 1fr)" gap={16}>
          <GridItem colSpan={1}>
            <Link href="/" _hover={{ textDecorarion: "none" }}>
              <HStack>
                <Flex h={20} alignItems="center">
                  <Logo width={6} height={6} />
                  <Text
                    marginLeft={4}
                    as="span"
                    fontFamily="display"
                    fontWeight="bold"
                    fontSize={20}
                  >
                    Agora Space
                  </Text>
                </Flex>
              </HStack>
            </Link>
          </GridItem>
          <GridItem colSpan={4}>
            <HStack h={20} alignItems="center" justifyContent="flex-end">
              <HStack as="nav" spacing={2} mr="auto">
                {headerNavItems.map((link) => (
                  <Link
                    key={link.name.toLowerCase()}
                    href={link.path}
                    px={4}
                    bgColor={
                      router.pathname.includes(link.path)
                        ? "indigo.50"
                        : "transparent"
                    }
                    height={10}
                    borderRadius="md"
                    textColor={
                      router.pathname.includes(link.path) ? "indigo.600" : "gray.800"
                    }
                    fontWeight="semibold"
                    _hover={{
                      textDecoration: "none",
                      bgColor: router.pathname.includes(link.path)
                        ? "indigo.50"
                        : "gray.100",
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </HStack>

              <ColorModeSwitch />

              <HStack spacing={4}>
                <Icon as={Wallet} />
                <Text as="span" fontWeight="semibold">
                  {account && shortenHex(account, 4)}
                </Text>
              </HStack>
            </HStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}

export default Header
