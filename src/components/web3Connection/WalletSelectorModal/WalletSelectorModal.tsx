import { useEffect, useRef } from "react"
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from "@web3-react/abstract-connector"
import MetaMaskOnboarding from "@metamask/onboarding"
import injected from "connectors"
import { Link } from "components/common/Link"
import { Error } from "components/common/Error"
import { motion, AnimatePresence } from "framer-motion"
import ConnectorButton from "./components/ConnectorButton"
import processConnectionError from "./utils/processConnectionError"

const MotionModal = motion(Modal)
const MotionModalContent = motion(ModalContent)

type Props = {
  activatingConnector: AbstractConnector
  setActivatingConnector: (connector: AbstractConnector) => void
  isModalOpen: boolean
  closeModal: () => void
}

const Web3Modal = ({
  activatingConnector,
  setActivatingConnector,
  isModalOpen,
  closeModal,
}: Props): JSX.Element => {
  const { error } = useWeb3React()
  const { active, activate, connector, setError } = useWeb3React()
  const modalDrag = useBreakpointValue({ base: "y", md: false })
  const modalInitialBottom = useBreakpointValue({ base: -100, md: 0 })

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }

  const handleConnect = () => {
    setActivatingConnector(injected)
    activate(injected, undefined, true).catch((err) => {
      setActivatingConnector(undefined)
      setError(err)
    })
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  const handleModalDrag = (_, info) => {
    if (info.offset.y > 100) {
      closeModal()
    }
  }

  useEffect(() => {
    if (active) {
      closeModal()
    }
  }, [active, closeModal])

  return (
    <AnimatePresence>
      <MotionModal motionPreset="none" isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay
          key="motionmodaloverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transitionDuration="0.2"
        />
        <MotionModalContent
          key="motionmodalcontent"
          initial={{ opacity: 0, bottom: modalInitialBottom }}
          animate={{ opacity: 1, bottom: 0 }}
          exit={{ opacity: 0, bottom: modalInitialBottom }}
          transition={{ duration: 0.2 }}
          drag={modalDrag}
          dragConstraints={{ top: 100 }}
          onDragEnd={handleModalDrag}
        >
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Error error={error} processError={processConnectionError} />
            <Stack spacing="4">
              <ConnectorButton
                name={
                  typeof window !== "undefined" &&
                  MetaMaskOnboarding.isMetaMaskInstalled()
                    ? "MetaMask"
                    : "Install MetaMask"
                }
                onClick={
                  typeof window !== "undefined" &&
                  MetaMaskOnboarding.isMetaMaskInstalled()
                    ? handleConnect
                    : handleOnboarding
                }
                iconUrl="metamask.png"
                disabled={!!activatingConnector || connector === injected}
                isActive={connector === injected}
                isLoading={activatingConnector && activatingConnector === injected}
              />
              <Button as="p" disabled isFullWidth size="xl">
                More options coming soon
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Text textAlign="center">
              New to Ethereum wallets?{" "}
              <Link
                color="primary.500"
                target="_blank"
                href="https://ethereum.org/en/wallets/"
              >
                Learn more
              </Link>
            </Text>
          </ModalFooter>
        </MotionModalContent>
      </MotionModal>
    </AnimatePresence>
  )
}

export default Web3Modal
