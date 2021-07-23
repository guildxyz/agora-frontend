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

const Account = (): JSX.Element => {
  const communityData = useCommunity()
  const { error, account, chainId } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false })

  if (typeof window === "undefined") {
    return (
      <Button variant="ghost" isLoading>
        Connect to a wallet
      </Button>
    )
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <Button
        variant="ghost"
        leftIcon={<LinkBreak />}
        colorScheme="red"
        onClick={openModal}
      >
        Wrong Network
      </Button>
    )
  }
  if (typeof account !== "string") {
    return (
      <Button
        variant="ghost"
        leftIcon={<SignIn />}
        isLoading={!triedEager}
        onClick={openModal}
      >
        Connect to a wallet
      </Button>
    )
  }
  return (
    <>
      <ButtonGroup isAttached variant="ghost">
        <Button width={isMobile && "40%"}>
          {Chains[chainId].charAt(0).toUpperCase() + Chains[chainId].slice(1)}
        </Button>
        <Divider orientation="vertical" h="var(--chakra-space-11)" />

        <Button width={isMobile && "60%"} onClick={onOpen}>
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
        </Button>
      </ButtonGroup>

      <AccountModal {...{ isOpen, onClose }} />
    </>
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
