import {
  Box,
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
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/admin/common/Section"
import ValidationError from "components/admin/common/ValidationError"
import NetworkChangeModal from "components/common/Layout/components/Account/components/NetworkModal/NetworkModal"
import { Chains, RPC } from "connectors"
import Image from "next/image"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import useTokenSymbol from "./hooks/useTokenSymbol"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors, touchedFields },
    setValue,
    trigger,
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

  useEffect(() => setValue("chainName", Chains[chainId]), [chainId, setValue])

  useEffect(() => {
    if (touchedFields.tokenAddress) trigger("tokenAddress")
  }, [isTokenSymbolValidating, error, trigger, touchedFields])

  const { colorMode } = useColorMode()

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
              <Stack direction={{ base: "column", md: "row" }} mt={4} spacing={2}>
                <Button
                  variant="ghost"
                  colorScheme="gray"
                  px={6}
                  height={10}
                  bgColor={colorMode === "light" ? "gray.100" : "whiteAlpha.200"}
                  width={{ base: "full", md: "max-content" }}
                  onClick={onOpen}
                >
                  <HStack>
                    <Box position="relative" width={4} height={4}>
                      <Image
                        alt={`${RPC[Chains[chainId]].chainName} icon`}
                        src={RPC[Chains[chainId]].iconUrls[0]}
                        layout="fill"
                      />
                    </Box>
                    <Text as="span" fontSize="sm">
                      {RPC[Chains[chainId]].chainName}
                    </Text>
                  </HStack>
                </Button>
                <InputGroup>
                  <Input
                    {...register("tokenAddress", {
                      required: "This field is required.",
                      pattern: {
                        value: /^0x[A-F0-9]{40}$/i,
                        message:
                          "Please input a 42 characters long, 0x-prefixed hexadecimal address.",
                      },
                      validate: () =>
                        isTokenSymbolValidating ||
                        !error ||
                        "Failed to fetch symbol. Please switch to the correct network.",
                    })}
                    isInvalid={errors.tokenAddress}
                  />
                  {((!error && tokenSymbol !== undefined) ||
                    isTokenSymbolValidating) && (
                    <InputRightAddon fontSize={{ base: "xs", sm: "md" }}>
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
              </Stack>
              <ValidationError fieldName="tokenAddress" />
            </FormControl>
          </GridItem>
        </Grid>
        <NetworkChangeModal isOpen={isOpen} onClose={onClose} />
      </>
    </Section>
  )
}

export default UsedToken
