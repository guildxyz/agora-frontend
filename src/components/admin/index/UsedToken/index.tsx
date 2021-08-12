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
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import useTokenInfo from "./hooks/useTokenInfo"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext()
  const tokenAddress = watch("token.address")
  const selectedChain = watch("chainName")

  const { tokenInfo, isValidating, error } = useTokenInfo(
    tokenAddress,
    selectedChain
  )

  useEffect(() => {
    setValue("token", {
      address: getValues("token.address"),
      ...tokenInfo,
    })
  }, [tokenInfo, setValue, getValues])

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
                {...register("token.address", {
                  required: true,
                  maxLength: 42,
                  pattern: /^0x[A-F0-9]{40}$/i,
                })}
                isInvalid={!!errors.token?.address}
              />
              {(tokenInfo || isValidating) && (
                <InputRightAddon>
                  {isValidating ? "[loading...]" : tokenInfo.symbol}
                </InputRightAddon>
              )}
            </InputGroup>
            {!isValidating && (!!errors.token?.address || !!error) && (
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
