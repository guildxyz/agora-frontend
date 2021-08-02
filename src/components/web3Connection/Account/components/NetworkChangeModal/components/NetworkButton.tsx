import { Box, Button, Image, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useRequestNetworkChange from "components/web3Connection/Account/hooks/useRequestNetworkChange"
import { Chains, RPC } from "connectors"

type Props = {
  chain: string
}

const NetworkButton = ({ chain }: Props) => {
  const { chainId } = useWeb3React()
  const requestNetworkChange = useRequestNetworkChange(chain)

  return (
    <Tooltip
      isDisabled={Chains[chain] !== chainId}
      label={`${RPC[chain].chainName} is currently selected`}
    >
      <Box>
        <Button
          rightIcon={
            <Image
              src={`networkLogos/${chain}.svg`}
              h="6"
              w="6"
              alt={`${RPC[chain].chainName} logo`}
            />
          }
          variant={Chains[chain] === chainId ? "outline" : "solid"}
          disabled={Chains[chain] === chainId}
          onClick={requestNetworkChange}
          isFullWidth
          size="xl"
          justifyContent="space-between"
        >
          {RPC[chain].chainName}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default NetworkButton
