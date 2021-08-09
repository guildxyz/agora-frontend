import {
  Badge,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/Section"

const Platforms = (): JSX.Element => (
  <Section
    title="Platforms"
    description="Chat platforms your community will be available on"
    cardType
  >
    <VStack>
      <Grid width="full" templateColumns="auto 100%" gap={12}>
        <GridItem colSpan={1}>
          <FormControl display="flex" height="full" alignItems="center">
            <Switch colorScheme="primary" mr={4} />
            <FormLabel margin={0}>Discord</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl>
            <InputGroup>
              <InputLeftAddon>Server ID</InputLeftAddon>
              <Input width={64} />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl display="flex" height="full" alignItems="center">
            <Switch colorScheme="primary" mr={4} />
            <FormLabel margin={0}>Telegram</FormLabel>
          </FormControl>
        </GridItem>

        <GridItem colSpan={1}>
          <Text colorScheme="gray">
            You'll have to set the group IDs for every level
          </Text>
        </GridItem>

        <GridItem colSpan={2}>
          <Divider />
        </GridItem>

        <GridItem colSpan={2} mb={-8}>
          <Badge>Coming soon</Badge>
        </GridItem>

        <GridItem colSpan={1}>
          <FormControl display="flex" height="full" alignItems="center" isDisabled>
            <Switch colorScheme="primary" mr={4} isDisabled />
            <FormLabel width="max-content" margin={0}>
              Bridge platforms
            </FormLabel>
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <Text colorScheme="gray">
            All messages will be forwarded to every platform, so the community is
            unified
          </Text>
        </GridItem>
      </Grid>
    </VStack>
  </Section>
)

export default Platforms
