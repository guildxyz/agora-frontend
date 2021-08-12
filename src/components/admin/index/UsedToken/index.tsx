import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useFormContext } from "react-hook-form"
import useTokenSymbol from "./hooks/useTokenSymbol"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  const tokenAddress = watch("tokenAddress")
  const selectedChain = watch("chainName")

  const {
    data: tokenSymbol,
    isValidating: isTokenSymbolValidating,
    error,
  } = useTokenSymbol(tokenAddress, selectedChain)

  return (
    <Section
      title="Used token"
      description="The token that members will have to stake or hold to access non-open levels"
      cardType
    >
      <Grid templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }} gap={12}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Token address</FormLabel>
            <InputGroup>
              <Input
                {...register("tokenAddress", {
                  required: true,
                  pattern: /^0x[A-F0-9]{40}$/i,
                })}
                isInvalid={!!errors.tokenAddress}
              />
              {(tokenSymbol !== undefined || isTokenSymbolValidating) && (
                <InputRightAddon>
                  {isTokenSymbolValidating ? "[loading...]" : tokenSymbol}
                </InputRightAddon>
              )}
            </InputGroup>
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
    </Section>
  )
}

export default UsedToken
