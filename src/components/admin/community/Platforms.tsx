import {
  Badge,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
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

type DiscordError = {
  message: string
  type: "server" | "channels"
  showAuthBtn?: boolean
}

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

  const [discordError, setDiscordError] = useState<DiscordError | null>(null)

  const [serverSelectLoading, setServerSelectLoading] = useState(false)
  const [discordServers, setDiscordServers] = useState<DiscordServer[] | null>(null)
  const [channelSelectLoading, setChannelSelectLoading] = useState(false)
  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[] | null>(
    null
  )

  useEffect(() => {
    if (!account) return

    setServerSelectLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API}/community/administeredServers/${account}`)
      .then((response) => {
        // We don't know the DC id of the user
        if (response.status === 400) {
          setChannelSelectLoading(false)
          setDiscordError({
            message: "Please authenticate with Discord",
            type: "server",
            showAuthBtn: true,
          })
          setDiscordChannels(null)
          return
        }

        if (response.status !== 200) {
          setChannelSelectLoading(false)
          setDiscordError({
            message: "Couldn't fetch your discord servers",
            type: "server",
          })
          setDiscordChannels(null)
          return
        }

        return response.json()
      })
      .then((data) => {
        setDiscordServers(data)
        setServerSelectLoading(false)

        if (data.length === 0) {
          setDiscordError({
            message: "It seems like you don't have a Discord server yet.",
            type: "server",
          })
          return
        }

        setDiscordError(null)
      })
      .catch(console.error) // TODO?...
  }, [account])

  const onServerIdChange = (e) => {
    const serverId = e.target.value

    if (errors.discordServerId || discordError?.type === "server") return

    setChannelSelectLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API}/community/discordChannels/${serverId}`)
      .then((response) => {
        if (response.status !== 200) {
          setChannelSelectLoading(false)
          setDiscordError({
            message: "Couldn't fetch channels list from your Discord server",
            type: "channels",
          })
          setDiscordChannels(null)
          return
        }

        return response.json()
      })
      .then((data) => {
        setDiscordChannels(data)
        setChannelSelectLoading(false)

        if (data.length === 0) {
          setDiscordError({
            message:
              "It seems like you haven't invited Medousa to your Discord server yet.",
            type: "channels",
          })
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
            {watch("isDCEnabled") ? (
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
                {discordError && discordError.type === "server" && (
                  <HStack spacing={4} justifyItems="center">
                    <Text
                      color={colorMode === "light" ? "red.500" : "red.400"}
                      fontSize="sm"
                      mt={2}
                      height={8}
                    >
                      {discordError.message}
                    </Text>
                    {discordError.showAuthBtn && (
                      <Button
                        ml={4}
                        size="sm"
                        colorScheme="DISCORD"
                        isDisabled={!watch("isDCEnabled")}
                      >
                        Authenticate
                      </Button>
                    )}
                  </HStack>
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
                {discordError && discordError.type === "channels" && (
                  <Text
                    color={colorMode === "light" ? "red.500" : "red.400"}
                    fontSize="sm"
                    mt={2}
                  >
                    {discordError.message}
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
            ) : (
              <Text colorScheme="gray">
                Medousa will generate roles on your Discord server for every level
              </Text>
            )}
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
