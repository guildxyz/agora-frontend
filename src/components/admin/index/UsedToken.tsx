import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useFormContext } from "react-hook-form"

const UsedToken = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

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
                {...register("tokenAddress", { required: true })}
                isInvalid={!!errors.tokenAddress}
              />
              <InputRightAddon>TOKEN_NAME</InputRightAddon>
            </InputGroup>
          </FormControl>
        </GridItem>
      </Grid>
    </Section>
  )
}

export default UsedToken
