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
  Spinner,
  Switch,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

type DiscordChannel = {
  id: string
  name: string
  category: string
}

const Platforms = (): JSX.Element => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext()

  const { colorMode } = useColorMode()

  const [selectLoading, setSelectLoading] = useState(false)
  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[] | null>(
    null
  )
  const [discordError, setDiscordError] = useState(null)

  const onServerIdChange = (e) => {
    const serverId = e.target.value

    if (errors.discordServerId) return

    setSelectLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API}/community/discordChannels/${serverId}`)
      .then((response) => {
        if (response.status !== 200) {
          setSelectLoading(false)
          setDiscordError("Couldn't fetch channels list from your Discord server")
          return
        }

        return response.json()
      })
      .then((data) => {
        setDiscordChannels(data)
        setSelectLoading(false)

        if (data.length === 0) {
          setDiscordError(
            "It seems like you haven't invited Medousa to your Discord server yet."
          )
          return
        }

        setDiscordError(null)
      })
      .catch(console.error) // TODO?...
  }

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
            <VStack spacing={4} alignItems="start">
              <FormControl isDisabled={!watch("isDCEnabled")}>
                <InputGroup>
                  <InputLeftAddon>Server ID</InputLeftAddon>
                  <Input
                    width={64}
                    {...register("discordServerId", {
                      required: watch("isDCEnabled"),
                      minLength: 17,
                    })}
                    isInvalid={errors.discordServerId}
                    onChange={onServerIdChange}
                  />
                </InputGroup>
              </FormControl>
              {selectLoading && <Spinner />}
              {discordError && (
                <Text
                  color={colorMode === "light" ? "red.500" : "red.400"}
                  fontSize="sm"
                  mt={2}
                >
                  {discordError}
                </Text>
              )}
              {discordChannels?.length > 0 && (
                <FormControl isDisabled={!watch("isDCEnabled")}>
                  <FormLabel>Invite channel</FormLabel>
                  <InputGroup>
                    <Select
                      width={64}
                      placeholder="Select one"
                      {...register("inviteChannel", {
                        required: watch("isDCEnabled"),
                      })}
                      isInvalid={errors.inviteChannel}
                    >
                      {discordChannels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          {`#${channel.name} (${channel.category})`}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </FormControl>
              )}
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
