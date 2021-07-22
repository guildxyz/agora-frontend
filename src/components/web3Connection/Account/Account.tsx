import {
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import useBalance from "hooks/useBalance"
import { LinkBreak, SignIn } from "phosphor-react"
import { useContext } from "react"
import type { Token } from "temporaryData/types"
import shortenHex from "utils/shortenHex"
import AccountModal from "../AccountModal"
import Identicon from "../AccountModal/components/Identicon" // TODO: move this component to a more logical place...
import useENSName from "./hooks/useENSName"

type Props = {
  token: Token
}

const Account = (): JSX.Element => {
  const communityData = useCommunity()
  const { error, account } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const shortenHexText = useBreakpointValue({ base: 2, sm: 3 })

  if (typeof window === "undefined") {
    return (
      <Card type="modern">
        <Button variant="ghost" borderRadius="2xl" isLoading>
          Connect to a wallet
        </Button>
      </Card>
    )
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <Card type="modern">
        <Button
          variant="ghost"
          borderRadius="2xl"
          leftIcon={<LinkBreak />}
          colorScheme="red"
          onClick={openModal}
        >
          Wrong Network
        </Button>
      </Card>
    )
  }
  if (typeof account !== "string") {
    return (
      <Card type="modern">
        <Button
          variant="ghost"
          borderRadius="2xl"
          leftIcon={<SignIn />}
          isLoading={!triedEager}
          onClick={openModal}
        >
          Connect to a wallet
        </Button>
      </Card>
    )
  }
  return (
    <>
      <Card type="modern">
        <ButtonGroup isAttached variant="ghost">
          {!!communityData && (
            <>
              <Button borderRadius="2xl" fontWeight="bold">
                ChainName
              </Button>
              <Divider orientation="vertical" h="var(--chakra-space-11)" />
            </>
          )}
          {/* <Button leftIcon={<Wallet />} onClick={onOpen}>
            {ENSName || `${shortenHex(account, shortenHexText)}`}
          </Button> */}
          <Button borderRadius="2xl" onClick={onOpen}>
            <HStack>
              <VStack spacing={0} alignItems="flex-end">
                <Balance token={communityData.chainData.token} />
                <Text as="span" fontSize="xs" fontWeight="medium" colorScheme="gray">
                  {ENSName || `${shortenHex(account, 3)}`}
                </Text>
              </VStack>
              <Identicon address={account} size={28} />
            </HStack>
          </Button>
        </ButtonGroup>
      </Card>
      <AccountModal {...{ isOpen, onClose }} />
    </>
  )
}

/*
// Old...
const Balance = ({ token }: Props): JSX.Element => {
  const balance = useBalance(token)

  return (
    <Button mr="-px" isLoading={!balance}>
      {`${balance} ${token.name}`}
    </Button>
  )
}
*/

// TODO: loading state!
const Balance = ({ token }: Props): JSX.Element => {
  const balance = useBalance(token)

  return (
    <Text as="span" fontWeight="bold" fontSize="sm">
      {!balance ? "Loading..." : `${Number(balance).toFixed(0)} ${token.name}`}
    </Text>
  )
}

export default Account
