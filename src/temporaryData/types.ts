import { IconProps } from "phosphor-react"
import { EventData, State } from "xstate"

type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type AccessRequirement = {
  type: "open" | "hold" | "stake"
  amount: number
  timelockMs: number
}

type TelegramGroup = {
  id: number
}
type DiscordChannel = {
  id: number
}

type Level = {
  name: string
  desc: string
  imageUrl: string
  accessRequirement: AccessRequirement
  membersCount: number
  platforms: {
    telegramGroups: [] | TelegramGroup[]
    discordChannels: [] | DiscordChannel[]
  }
}

/* type Platforms = {
  [_ in PlatformName]: {
    active: boolean
    serverId?: number
  }
} */

type Platforms = {
  telegram: {
    active: boolean
  }
  discord: {
    active: boolean
    serverId: number
  }
}

type ChainData = {
  token: Token
  stakeToken: Token
  contract: {
    address: string
  }
}

type CommunityBase = {
  id: number
  urlName: string
  name: string
  description: string
  imageUrl: string
  theme: {
    color: string
  }
  ownerId: number
  platforms: Platforms
  levels: Level[]
}

type Community = CommunityBase & {
  chainData: {
    polygon: ChainData
  }
}

type ProvidedCommunity = CommunityBase & {
  chainData: ChainData
}

type MetaMaskError = { code: number; message: string }

type Machine<Context> = [
  State<Context>,
  (event: string, payload?: EventData) => State<Context>
]

type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

type Rest = {
  [x: string]: any
}

export type {
  Community,
  Token,
  Level,
  Platforms,
  AccessRequirement,
  ChainData,
  ProvidedCommunity,
  MetaMaskError,
  Machine,
  Icon,
  Rest,
}
