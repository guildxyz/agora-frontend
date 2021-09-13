import { Stack, Text, useColorMode, Wrap } from "@chakra-ui/react"
import { Lock, LockOpen, LockSimpleOpen, Tag } from "phosphor-react"
import { useMemo } from "react"
import type { Icon as IconType, Requirement } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"

type Props = {
  requirements: Requirement[]
  membersCount: number
  tokenSymbol: string
}

type ChildProps = {
  icon: IconType
  label: string
}

const InfoTag = ({ icon: Icon, label }: ChildProps): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Stack
      as="li"
      direction="row"
      textColor={colorMode === "light" ? "gray.450" : "gray.350"}
      alignItems="center"
      fontSize={{ base: "sm", md: "md" }}
      spacing={{ base: 1, sm: 2 }}
      pr={{ base: "2", md: "3" }}
    >
      <Icon size="1.3em" />
      <Text fontWeight="medium">{label}</Text>
    </Stack>
  )
}

const InfoTags = ({
  requirements,
  membersCount,
  tokenSymbol,
}: Props): JSX.Element => {
  const info = useMemo(() => {
    if (requirements?.length === 0)
      return {
        label: "open",
        icon: LockSimpleOpen,
      }
    if (requirements?.[0].stakeTimelockMs)
      return {
        label: "stake",
        icon: Lock,
      }

    if (requirements?.[0].type === "NFT")
      return {
        label: "hold NFT",
        icon: LockOpen,
      }
    return {
      label: "hold",
      icon: LockOpen,
    }
  }, [requirements])

  return (
    <Wrap direction="row" spacing={{ base: 2, lg: 4 }}>
      <InfoTag
        icon={info.icon}
        label={`${info.label} ${
          requirements?.[0]?.stakeTimelockMs
            ? `for ${msToReadableFormat(requirements?.[0]?.stakeTimelockMs)}`
            : ``
        }`}
      />
      {requirements?.[0] &&
        (requirements?.[0].type === "NFT" ? (
          <InfoTag icon={Tag} label={`${requirements?.[0].value}`} />
        ) : (
          <InfoTag icon={Tag} label={`${requirements?.[0].value} ${tokenSymbol}`} />
        ))}
      {/* temporarily removing tag until membersCount is buggy  */}
      {/* <InfoTag icon={Users} label={`${membersCount} members`} /> */}
    </Wrap>
  )
}

export default InfoTags
