import {
  Badge,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Select,
  Spinner,
  Switch,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/admin/common/Section"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

type DiscordServer = {
  id: string
  name: string
}

type DiscordChannel = {
  id: string
  name: string
  category: string
}

const Platforms = (): JSX.Element => {
  const { account } = useWeb3React()

  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext()

  const { colorMode } = useColorMode()

  const [serverSelectLoading, setServerSelectLoading] = useState(false)
  const [discordServers, setDiscordServers] = useState<DiscordServer[] | null>(null)
  const [discordServersError, setDiscordServersError] = useState(null)
  const [channelSelectLoading, setChannelSelectLoading] = useState(false)
  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[] | null>(
    null
  )
  const [discordChannelsError, setDiscordChannelsError] = useState(null)

  useEffect(() => {
    if (!account) return

    setServerSelectLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API}/community/administeredServers/${account}`)
      .then((response) => {
        if (response.status !== 200) {
          setChannelSelectLoading(false)
          setDiscordServersError("Couldn't fetch your discord servers")
          setDiscordChannels(null)
          return
        }

        return response.json()

        /*
        // DEBUG
        return [
          {
            name: "Devid test",
            id: "717317894954025012",
          },
          {
            name: "Agora Bot Test",
            id: "844222532994727957",
          },
        ]
        */
      })
      .then((data) => {
        setDiscordServers(data)
        setServerSelectLoading(false)

        if (data.length === 0) {
          setDiscordServersError(
            "It seems like you don't have a Discord server yet."
          )
          return
        }

        setDiscordServersError(null)
      })
      .catch(console.error) // TODO?...
  }, [account])

  const onServerIdChange = (e) => {
    const serverId = e.target.value

    if (errors.discordServerId || discordServersError) return

    setChannelSelectLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API}/community/discordChannels/${serverId}`)
      .then((response) => {
        if (response.status !== 200) {
          setChannelSelectLoading(false)
          setDiscordChannelsError(
            "Couldn't fetch channels list from your Discord server"
          )
          setDiscordChannels(null)
          return
        }

        return response.json()

        /*
        // DEBUG
        return [
          {
            id: "861688436566392863",
            name: "general",
            category: "MEDOUSA",
          },
          {
            id: "866288974959214602",
            name: "test",
            category: "MEDOUSA",
          },
        ]
        */
      })
      .then((data) => {
        setDiscordChannels(data)
        setChannelSelectLoading(false)

        if (data.length === 0) {
          setDiscordChannelsError(
            "It seems like you haven't invited Medousa to your Discord server yet."
          )
          return
        }

        setDiscordChannelsError(null)
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
              {serverSelectLoading && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                  >
                    <Spinner />
                  </motion.div>
                </AnimatePresence>
              )}

              {discordServers?.length > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                  >
                    <FormControl isDisabled={!watch("isDCEnabled")}>
                      <FormLabel>Pick a server</FormLabel>
                      <Select
                        width={64}
                        placeholder="Select one"
                        {...register("discordServerId", {
                          required: watch("isDCEnabled"),
                        })}
                        isInvalid={errors.discordServerId}
                        onChange={onServerIdChange}
                      >
                        {discordServers.map((server) => (
                          <option key={server.id} value={server.id}>
                            {`${server.name}`}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </motion.div>
                </AnimatePresence>
              )}
              {discordServersError && (
                <Text
                  color={colorMode === "light" ? "red.500" : "red.400"}
                  fontSize="sm"
                  mt={2}
                >
                  {discordServersError}
                </Text>
              )}

              {channelSelectLoading && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                  >
                    <Spinner />
                  </motion.div>
                </AnimatePresence>
              )}
              {discordChannelsError && (
                <Text
                  color={colorMode === "light" ? "red.500" : "red.400"}
                  fontSize="sm"
                  mt={2}
                >
                  {discordChannelsError}
                </Text>
              )}
              {discordChannels?.length > 0 && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                  >
                    <FormControl isDisabled={!watch("isDCEnabled")}>
                      <FormLabel>Invite channel</FormLabel>

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
                    </FormControl>
                  </motion.div>
                </AnimatePresence>
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
