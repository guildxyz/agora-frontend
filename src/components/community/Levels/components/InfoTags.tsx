import { Stack, Text } from "@chakra-ui/react"
import { Lock, LockOpen, LockSimpleOpen, Tag, Users } from "phosphor-react"
import { AccessRequirements } from "temporaryData/types"

type Props = {
  data: AccessRequirements
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
  <Stack
    mr={{ base: 4, md: 8 }}
    mb="2"
    direction="row"
    spacing="2"
    textColor="gray.450"
    fontSize={{ base: "sm", sm: "md" }}
    alignItems="center"
  >
    <Icon size="1.3em" />
    <Text fontWeight="medium">{label}</Text>
  </Stack>
)

const InfoTags = ({ data, membersCount, tokenSymbol }: Props): JSX.Element => (
  <Stack direction="row" spacing="0" wrap="wrap" shouldWrapChildren>
    <InfoTag icon={accessRequirementIcons[data.type]} label={data.type} />
    {data.type !== "open" && (
      <InfoTag icon={Tag} label={`${data.amount} ${tokenSymbol}`} />
    )}
    <InfoTag icon={Users} label={`${membersCount} members`} />
  </Stack>
)

export default InfoTags
