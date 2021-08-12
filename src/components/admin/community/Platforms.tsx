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
import Section from "components/admin/common/Section"
import { useFormContext } from "react-hook-form"

const Platforms = (): JSX.Element => {
  const {
    control,
    watch,
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Section
      title="Platforms"
      description="Chat platforms your community will be available on"
      cardType
    >
      <VStack>
        <Grid
          width="full"
          templateColumns={{ base: "100%", md: "auto 100%" }}
          gap={{ base: 8, md: 12 }}
        >
          <GridItem>
            <FormControl display="flex" height="full" alignItems="center">
              <Switch colorScheme="primary" mr={4} {...register("isDCEnabled")} />
              <FormLabel margin={0}>Discord</FormLabel>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isDisabled={!watch("isDCEnabled")}>
              <InputGroup>
                <InputLeftAddon>Server ID</InputLeftAddon>
                <Input
                  width={64}
                  {...register("discordServerId", {
                    required: watch("isDCEnabled"),
                  })}
                  isInvalid={!!errors.discordServerId}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl display="flex" height="full" alignItems="center">
              <Switch colorScheme="primary" mr={4} {...register("isTGEnabled")} />
              <FormLabel margin={0}>Telegram</FormLabel>
            </FormControl>
          </GridItem>

          <GridItem>
            <Text colorScheme="gray">
              You'll have to set the group IDs for every level
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Divider />
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }} mb={-8}>
            <Badge>Coming soon</Badge>
          </GridItem>

          <GridItem>
            <FormControl display="flex" height="full" alignItems="center" isDisabled>
              <Switch colorScheme="primary" mr={4} isDisabled />
              <FormLabel width="max-content" margin={0}>
                Bridge platforms
              </FormLabel>
            </FormControl>
          </GridItem>
          <GridItem>
            <Text colorScheme="gray">
              All messages will be forwarded to every platform, so the community is
              unified
            </Text>
          </GridItem>
        </Grid>
      </VStack>
    </Section>
  )
}

export default Platforms
