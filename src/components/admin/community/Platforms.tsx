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
  Select,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useFormContext } from "react-hook-form"

const Platforms = (): JSX.Element => {
  const {
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
            <VStack spacing={4}>
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

              <FormControl isDisabled={!watch("isDCEnabled")}>
                <FormLabel>Invite channel</FormLabel>
                <InputGroup>
                  {/* TODO: fetch "/discordChannels/${discordServerId}". If it return an empty array, show an error message, and tell the user that they should invite Medouse to their DC server. Otherwise, list the available channels and let the user pick one (requred field).
                  
                  Response format:
                  [
                    {
                        "id": "861688436566392863",
                        "name": "general",
                        "category": "MEDOUSA"
                    },
                    {
                        "id": "866288974959214602",
                        "name": "test",
                        "category": "MEDOUSA"
                    }
                  ]
                  */}
                  <Select
                    width={64}
                    placeholder="Select one"
                    {...register("discordInviteChannelId", {
                      required: watch("isDCEnabled"),
                    })}
                    isInvalid={!!errors.discordInviteChannelId}
                  >
                    <option value="1">Welcome</option>
                  </Select>
                </InputGroup>
              </FormControl>
            </VStack>
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
