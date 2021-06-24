import { Stack, Text } from "@chakra-ui/react"
import { Lock, LockOpen, LockSimpleOpen, Tag, Users, Chats } from "phosphor-react"
import { AccessRequirements } from "temporaryData/types"

type Props = {
  type: "community" | "level"
  data?: AccessRequirements
  messagesCount?: number
  membersCount: number
  tokenSymbol: string
}

const accessRequirementIcons = {
  open: LockSimpleOpen,
  hold: LockOpen,
  stake: Lock,
}

type ChildProps = {
  icon: React.ElementType
  label: string
}

const InfoTag = ({ icon: Icon, label }: ChildProps): JSX.Element => (
  <Stack direction="row" spacing="2" textColor="gray.450" alignItems="center">
    <Icon size="1.3em" />
    <Text fontWeight="medium">{label}</Text>
  </Stack>
)

const InfoTags = ({
  type,
  data,
  messagesCount,
  membersCount,
  tokenSymbol,
}: Props): JSX.Element => (
  <Stack direction="row" spacing="8">
    {type === "level" && data && (
      <InfoTag icon={accessRequirementIcons[data.type]} label={data.type} />
    )}
    {type === "level" && data?.type !== "open" && (
      <InfoTag icon={Tag} label={`${data.amount} ${tokenSymbol}`} />
    )}
    {type === "community" && <InfoTag icon={Chats} label={`${messagesCount}`} />}
    <InfoTag
      icon={Users}
      label={`${membersCount} ${type === "level" ? "members" : ""}`}
    />
    {type === "community" && <InfoTag icon={Tag} label={`${tokenSymbol}`} />}
  </Stack>
)

export default InfoTags
