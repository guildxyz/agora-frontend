import {
  Button,
  ButtonGroup,
  Divider,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react"
import { BigNumber } from "@ethersproject/bignumber"
import { ExternalProvider } from "@ethersproject/providers"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import { addToWalletData, Chains } from "connectors"
import useBalance from "hooks/useBalance"
import { LinkBreak, SignIn, Wallet } from "phosphor-react"
import { useContext } from "react"
import type { Token } from "temporaryData/types"
import shortenHex from "utils/shortenHex"
import AccountModal from "../AccountModal"
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
  const shortenHexText = useBreakpointValue({ base: 2, sm: 3 })

  const requestNetworkChange = async () => {
    const { ethereum } = window as Window &
      typeof globalThis & { ethereum: ExternalProvider }

    // If we are on the all communities page, we dont have a chainData from communityData, setting Polygon as a default there
    const chainName = communityData?.chainData.name ?? "polygon"

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: BigNumber.from(Chains[chainName]).toHexString(),
          },
        ],
      })
    } catch (e) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (e.code === 4902) {
        try {
          if (!addToWalletData[chainName]) throw Error()

          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [addToWalletData[chainName]],
          })
        } catch (addError) {
          console.error("Failed to add network to MetaMask")
        }
      }
      // handle other "switch" errors
    }
  }

  if (typeof window === "undefined") {
    return (
      <Card>
        <Button variant="ghost" isLoading>
          Connect to a wallet
        </Button>
      </Card>
    )
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <Card>
        <Button
          variant="ghost"
          onClick={requestNetworkChange}
          leftIcon={<LinkBreak />}
          colorScheme="red"
        >
          Wrong Network
        </Button>
      </Card>
    )
  }
  if (typeof account !== "string") {
    return (
      <Card>
        <Button
          variant="ghost"
          isLoading={!triedEager}
          onClick={openModal}
          leftIcon={<SignIn />}
        >
          Connect to a wallet
        </Button>
      </Card>
    )
  }
  return (
    <>
      <Card>
        <ButtonGroup isAttached variant="ghost">
          {!!communityData && (
            <>
              <Balance token={communityData.chainData.token} />
              <Divider orientation="vertical" h="var(--chakra-space-11)" />
            </>
          )}
          <Button leftIcon={<Wallet />} onClick={onOpen}>
            {ENSName || `${shortenHex(account, shortenHexText)}`}
          </Button>
        </ButtonGroup>
      </Card>
      <AccountModal {...{ isOpen, onClose }} />
    </>
  )
}

const Balance = ({ token }: Props): JSX.Element => {
  const balance = useBalance(token)

  return (
    <Button mr="-px" isLoading={!balance}>
      {`${balance} ${token.name}`}
    </Button>
  )
}

export default Account
