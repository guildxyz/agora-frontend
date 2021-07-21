import { Heading, Image, Portal, Stack, Tag } from "@chakra-ui/react"
import Card from "components/common/Card"
import { Link } from "components/common/Link"
import { useCommunity } from "components/community/Context"
import useLevelAccess from "components/community/Levels/components/Level/hooks/useLevelAccess"
import { MutableRefObject, useMemo } from "react"
import useIsMemberOfCommunity from "./hooks/useIsMemberOfCommunity"

type Props = {
  refYours: MutableRefObject<HTMLDivElement>
  refAccess: MutableRefObject<HTMLDivElement>
  refOther: MutableRefObject<HTMLDivElement>
}

const CommunityCard = ({ refYours, refOther, refAccess }: Props): JSX.Element => {
  const {
    levels,
    urlName,
    imageUrl,
    name: communityName,
    chainData: {
      token: { symbol: tokenSymbol },
    },
  } = useCommunity()
  const [hasAccess] = useLevelAccess(levels[0].accessRequirement)
  const isMember = useIsMemberOfCommunity()

  const containerRef = useMemo(() => {
    if (isMember) return refYours
    if (hasAccess) return refAccess
    return refOther
  }, [isMember, hasAccess, refYours, refAccess, refOther])

  const membersCount = levels
    .map((level) => level.membersCount)
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  return (
    <Portal containerRef={containerRef}>
      <Link href={`/${urlName}`} _hover={{ textDecor: "none" }} borderRadius="2xl">
        <Card
          role="group"
          p="7"
          bgGradient="linear(to-l, var(--chakra-colors-primary-50), white)"
          bgRepeat="no-repeat"
          bgSize="150%"
          bgPosition="-100%"
          transition="background-position 0.6s ease"
          _hover={{
            bgPosition: "0",
            transition: "background-position 0.4s ease",
          }}
        >
          <Stack
            position="relative"
            direction="row"
            spacing="10"
            alignItems="center"
          >
            <Image src={`${imageUrl}`} boxSize="45px" alt="Level logo" />
            <Stack spacing="3">
              <Heading size="sm">{communityName}</Heading>
              <Stack direction="row" spacing="3">
                <Tag
                  colorScheme="blackAlpha"
                  textColor="blackAlpha.700"
                >{`${membersCount} members`}</Tag>
                <Tag colorScheme="blackAlpha" textColor="blackAlpha.700">
                  {`${levels.length} levels`}
                </Tag>
                <Tag colorScheme="blackAlpha" textColor="blackAlpha.700">
                  {`min: ${levels[0].accessRequirement.amount} ${tokenSymbol}`}
                </Tag>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Link>
    </Portal>
  )
}

export default CommunityCard
