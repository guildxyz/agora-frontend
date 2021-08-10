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

const UsedToken = (): JSX.Element => (
  <Section
    title="Used token"
    description="The token that members will have to stake or hold to access non-open levels"
    cardType
  >
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <GridItem>
        <FormControl id="token_name_address">
          <FormLabel>Token name or address</FormLabel>
          <InputGroup>
            <Input />
            <InputRightAddon>ETHANE</InputRightAddon>
          </InputGroup>
        </FormControl>
      </GridItem>
    </Grid>
  </Section>
)

export default UsedToken
