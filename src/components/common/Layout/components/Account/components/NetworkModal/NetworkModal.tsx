import {
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Error } from "components/common/Error"
import Modal from "components/common/Modal"
import { useCommunity } from "components/[community]/common/Context"
import processConnectionError from "components/_app/Web3ConnectionManager/components/WalletSelectorModal/utils/processConnectionError"
import { Chains, RPC, supportedChains } from "connectors"
import useWalletType from "hooks/useWalletType"
import Image from "next/image"
import { useMemo } from "react"
import Wallets from "utils/wallets"
import NetworkButton from "./components/NetworkButton"
import requestNetworkChange from "./utils/requestNetworkChange"

const NetworkModal = ({ isOpen, onClose }) => {
  const { error, chainId } = useWeb3React()
  const wallet = useWalletType()
  const communityData = useCommunity()
  const availableChains = communityData?.availableChains
  const walletConnectNetworks = useMemo(
    () =>
      (availableChains?.length > 0 ? availableChains : supportedChains).filter(
        (chain) => chain !== Chains[chainId]
      ),
    [availableChains, chainId]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {wallet === Wallets.WALLETCONNECT
            ? "Supported networks"
            : "Select network"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {wallet === Wallets.WALLETCONNECT && (
            <>
              <VStack spacing={8} alignItems="flex-start">
                <VStack alignItems="flex-start">
                  {walletConnectNetworks.length ? (
                    <>
                      <Text>
                        Different communities can use different networks, try to
                        connect your wallet on one of the following ones:
                      </Text>
                      {walletConnectNetworks.map((chain) => (
                        <HStack key={chain} spacing={5}>
                          <Image
                            width={30}
                            height={30}
                            src={RPC[chain].iconUrls[0]}
                            alt={`${RPC[chain].chainName} icon`}
                          />
                          <Text>{RPC[chain].chainName}</Text>
                        </HStack>
                      ))}
                    </>
                  ) : (
                    <Text>
                      {communityData.name} only uses the{" "}
                      {RPC[Chains[chainId]].chainName} network
                    </Text>
                  )}
                </VStack>
              </VStack>
            </>
          )}

          {wallet === Wallets.METAMASK && (
            <>
              <Error error={error} processError={processConnectionError} />
              <Stack spacing={3}>
                {supportedChains.map((chain) => (
                  <NetworkButton
                    key={chain}
                    chain={chain}
                    requestNetworkChange={requestNetworkChange(chain, onClose)}
                  />
                ))}
              </Stack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NetworkModal
