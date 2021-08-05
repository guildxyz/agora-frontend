import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Logo from "components/common/Layout/components/LogoWithMenu/components/Logo"
import Link from "components/common/Link"
import { Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"

const Header = (): JSX.Element => {
  const { account } = useWeb3React()

  return (
    <Box as="header" bgColor="white" boxShadow="base">
      <Container maxW="container.lg" px={{ base: 4, sm: 6, md: 8, lg: 10 }}>
        <Grid templateColumns="repeat(4, 1fr)" gap={16}>
          <GridItem colSpan={1}>
            <Link href="/" _hover={{ textDecorarion: "none" }}>
              <HStack>
                <Flex h={20} alignItems="center">
                  <Logo width={6} height={6} />
                  <Text
                    marginLeft={4}
                    as="span"
                    fontFamily="display"
                    fontWeight="semibold"
                    fontSize={20}
                  >
                    Agora Space
                  </Text>
                </Flex>
              </HStack>
            </Link>
          </GridItem>
          <GridItem colSpan={3}>
            <HStack h={20} alignItems="center" justifyContent="space-between">
              <nav>
                <Link
                  href="/admin"
                  px={4}
                  // bgColor="gray.100"
                  bgColor="indigo.50"
                  height={10}
                  borderRadius="md"
                  // textColor="gray.800"
                  textColor="indigo.600"
                  fontWeight="semibold"
                  _hover={{ textDecoration: "none" }}
                >
                  Settings
                </Link>
              </nav>

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
