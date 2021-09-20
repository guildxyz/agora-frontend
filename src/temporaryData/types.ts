import { IconProps } from "phosphor-react"
import { EventData, State } from "xstate"

type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
}

type RequirementType = "TOKEN" | "NFT" | "POAP"

type Requirement = {
  type: RequirementType
  address?: string
  method?: string
  data?: string
  value: string | number
  stakeTimelockMs?: number
}

type Level = {
  id: number
  name: string
  description: string
  imageUrl: string
  membersCount: number
  requirements: Requirement[]
  telegramGroupId: string
  discordRole: string
}

type PlatformName = "TELEGRAM" | "DISCORD"

type Platform = {
  name: PlatformName
  active: boolean
  platformId: string
  inviteChannel?: string
}

type ChainData = {
  token: Token
  stakeToken?: Token
  contractAddress?: string
  name: string
}

type CommunityBase = {
  id: number
  urlName: string
  name: string
  description: string
  imageUrl: string
  themeColor: string
  marketcap?: number
  levels: Level[]
  parallelLevels: boolean
  membersCount?: number
  communityPlatforms: Platform[]
  holdersCount?: number
  owner?: {
    id: number
    addresses: Array<{ address: string; userId?: number }>
    telegramId: string
    discordId: string
  }
}

type Community = CommunityBase & {
  chainData: ChainData[]
}

type ProvidedCommunity = CommunityBase & {
  chainData: ChainData
  availableChains: string[]
  allChainData?: ChainData[]
}

type WalletError = { code: number; message: string }

type DiscordError = { error: string; errorDescription: string }

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
  RequirementType,
  Requirement,
  ChainData,
  ProvidedCommunity,
  WalletError,
  Machine,
  Icon,
  Rest,
  Platform,
  PlatformName,
  DiscordError,
}
