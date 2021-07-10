import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useContext } from "react"
import shortenHex from "utils/shortenHex"
import { Web3Connection } from "../Web3ConnectionManager"
import Identicon from "./components/Identicon"
import AppModal from "components/common/AppModal"

const AccountModal = ({ isOpen, onClose }) => {
  const { account } = useWeb3React()
  const { openModal } = useContext(Web3Connection)
  const { hasCopied, onCopy } = useClipboard(account)

  const handleWalletProviderSwitch = () => {
    openModal()
    onClose()
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose}>
      <>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack direction="row" spacing="4" alignItems="center">
            <Identicon address={account} />
            <Tooltip
              placement="top"
              label={hasCopied ? "Copied" : "Click to copy address"}
              closeOnClick={false}
              hasArrow
            >
              <Button onClick={onCopy} variant="unstyled">
                <Text fontSize="2xl" fontWeight="semibold">
                  {shortenHex(account, 5)}
                </Text>
              </Button>
            </Tooltip>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium" textColor="gray.500">
              Connected with MetaMask
            </Text>
            <Button size="sm" variant="outline" onClick={handleWalletProviderSwitch}>
              Switch
            </Button>
          </Stack>
        </ModalFooter>
      </>
    </AppModal>
  )
}

export default AccountModal
