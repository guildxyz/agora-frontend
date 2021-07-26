import {
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Text,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import { Chains } from "connectors"
import useBalance from "hooks/useBalance"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import type { Token } from "temporaryData/types"
import shortenHex from "utils/shortenHex"
import AccountModal from "../AccountModal"
import Identicon from "../components/Identicon"
import useENSName from "./hooks/useENSName"

type Props = {
  token: Token
}

const AccountCard = ({ children }): JSX.Element => {
  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (isMobile) {
    return (
      <Card
        position="fixed"
        left={0}
        bottom={0}
        width="100vw"
        background={colorMode === "light" ? "whiteAlpha.700" : "blackAlpha.400"}
        borderTop="1px"
        borderTopColor={colorMode === "light" ? "gray.100" : "gray.600"}
        borderRadius="none"
        zIndex="docked"
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        {children}
      </Card>
    )
  }
  return <Card>{children}</Card>
}

const AccountButton = ({ children, ...rest }): JSX.Element => (
  <Button
    variant="ghost"
    flexGrow={1}
    /**
     * Space 11 is added to the theme by us and Chakra doesn't recognize it just by
     * "11" for some reason
     */
    h={{ base: 14, md: "var(--chakra-space-11)" }}
    borderRadius="0"
    {...rest}
  >
    {children}
  </Button>
)

const Account = (): JSX.Element => {
  const communityData = useCommunity()
  const { error, account, chainId } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()

  if (typeof window === "undefined") {
    return (
      <AccountCard>
        <AccountButton isLoading>Connect to a wallet</AccountButton>
      </AccountCard>
    )
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<LinkBreak />}
          colorScheme="red"
          onClick={openModal}
        >
          Wrong Network
        </AccountButton>
      </AccountCard>
    )
  }
  if (typeof account !== "string") {
    return (
      <AccountCard>
        <AccountButton
          leftIcon={<SignIn />}
          isLoading={!triedEager}
          onClick={openModal}
        >
          Connect to a wallet
        </AccountButton>
      </AccountCard>
    )
  }
  return (
    <AccountCard>
      <ButtonGroup isAttached variant="ghost" alignItems="center">
        <AccountButton>
          {Chains[chainId].charAt(0).toUpperCase() + Chains[chainId].slice(1)}
        </AccountButton>
        <Divider
          orientation="vertical"
          /**
           * Space 11 is added to the theme by us and Chakra doesn't recognize it
           * just by "11" for some reason
           */
          h={{ base: 14, md: "var(--chakra-space-11)" }}
        />
        <AccountButton onClick={onOpen}>
          <HStack>
            <VStack spacing={0} alignItems="flex-end">
              {!!communityData && <Balance token={communityData.chainData.token} />}
              <Text
                as="span"
                fontSize={communityData ? "xs" : "md"}
                fontWeight={communityData ? "medium" : "semibold"}
                color={
                  !!communityData &&
                  (colorMode === "light" ? "gray.600" : "gray.400")
                }
              >
                {ENSName || `${shortenHex(account, 3)}`}
              </Text>
            </VStack>
            <Identicon address={account} size={28} />
          </HStack>
        </AccountButton>
      </ButtonGroup>

      <AccountModal {...{ isOpen, onClose }} />
    </AccountCard>
  )
}

const Balance = ({ token }: Props): JSX.Element => {
  const balance = useBalance(token)

  const convertBalance = (): string => {
    let decimals = 0

    if (balance < 10) {
      decimals = 3
    } else if (balance < 100) {
      decimals = 2
    } else if (balance < 1000) {
      decimals = 1
    }

    return Number(balance).toFixed(decimals)
  }

  return (
    <Text as="span" fontWeight="bold" fontSize="sm">
      {!balance ? "Loading..." : `${convertBalance()} ${token.name}`}
    </Text>
  )
}

export default Account
