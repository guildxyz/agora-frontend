import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/admin/common/Section"
import NetworkChangeModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { Chains, RPC } from "connectors"
import Image from "next/image"
import React from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useTokenSymbol from "./hooks/useTokenSymbol"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const { chainId } = useWeb3React()

  const tokenAddress = useWatch({ name: "tokenAddress" })
  const selectedChain = useWatch({
    name: "chainName",
    // We cannot set this default value in the useForm, since the chainId id undefned on first render
    defaultValue: Chains[chainId],
  })

  const {
    data: tokenSymbol,
    isValidating: isTokenSymbolValidating,
    error,
  } = useTokenSymbol(tokenAddress, selectedChain)

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Section
      title="Used token"
      description="The token that members will have to stake or hold to access non-open levels"
      cardType
    >
      <>
        <Grid templateColumns={{ base: "100%" }} gap={12}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Token address</FormLabel>
              <HStack spacing={3}>
                <Button
                  colorScheme="primary"
                  variant="outline"
                  bgColor="primary.100"
                  borderWidth="1px"
                  p={0}
                  width="6%"
                  onClick={onOpen}
                >
                  <Image
                    alt={`${RPC[Chains[chainId]].chainName} icon`}
                    src={RPC[Chains[chainId]].iconUrl}
                    width={25}
                    height={25}
                  />
                </Button>
                <InputGroup>
                  <Input
                    {...register("tokenAddress", {
                      required: true,
                      pattern: /^0x[A-F0-9]{40}$/i,
                    })}
                    isInvalid={!!errors.tokenAddress}
                  />
                  {((!error && tokenSymbol !== undefined) ||
                    isTokenSymbolValidating) && (
                    <InputRightAddon>
                      {tokenSymbol === undefined && isTokenSymbolValidating ? (
                        <HStack px={4} alignContent="center">
                          <Spinner size="sm" color="blackAlpha.400" />
                        </HStack>
                      ) : (
                        tokenSymbol
                      )}
                    </InputRightAddon>
                  )}
                </InputGroup>
              </HStack>
              {!isTokenSymbolValidating && (!!errors.tokenAddress || !!error) && (
                <Text color="red" fontSize={12} mt={2}>
                  {error
                    ? "Failed to fetch token data, is the correct chain selected?"
                    : "Please input a 42 characters length, 0x-prefixed hexadecimal address."}
                </Text>
              )}
            </FormControl>
          </GridItem>
        </Grid>
        <NetworkChangeModal isOpen={isOpen} onClose={onClose} />
      </>
    </Section>
  )
}

export default UsedToken
