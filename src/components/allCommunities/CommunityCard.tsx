import { Heading, Image, Portal, Stack, Tag } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import { Link } from "components/common/Link"
import { CommunityProvider, useCommunity } from "components/community/Context"
import { useLevelAccess } from "components/community/Levels/components/Level/hooks/useLevelAccess"
import { Chains } from "connectors"
import { MutableRefObject } from "react"
import type { Community } from "temporaryData/communities"

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

  const membersCount = levels
    .map((level) => level.membersCount)
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  const [hasAccess] = useLevelAccess(levels[0].accessRequirement)

  return (
    <Portal containerRef={hasAccess ? refAccess : refOther}>
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
