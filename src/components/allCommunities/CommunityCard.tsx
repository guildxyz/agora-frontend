import { Link } from "components/common/Link"
import type { Community } from "temporaryData/communities"
import { Image, Heading, Stack, Tag } from "@chakra-ui/react"
import Card from "components/common/Card"

type Props = {
  community: Community
}

const CommunityCard = ({ community }: Props): JSX.Element => {
  const membersCount = community.levels
    .map((level) => level.membersCount)
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  return (
    <Link
      href={`/${community.urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
    >
      <Card
        role="group"
        p="7"
        borderRadius="2xl"
        overflow="hidden"
        bgGradient={`linear(to-l, ${community.theme.color}40, white)`}
        bgRepeat="no-repeat"
        bgSize="200% 200%"
        bgPosition="-100% 0"
        transition="background-position 0.6s ease"
        _hover={{
          bgPosition: "0 0",
          transition: "background-position 0.4s ease",
        }}
      >
        <Stack direction="row" spacing="10">
          <Image src={`${community.imageUrl}`} boxSize="45px" alt="Level logo" />
          <Stack spacing="3">
            <Heading size="sm">{community.name}</Heading>
            <Stack direction="row" spacing="3">
              <Tag
                textColor="gray.500"
                background="gray.100"
                transition="background 0.4s ease"
                _groupHover={{
                  background: "transparent",
                }}
              >
                {community.levels.length} levels
              </Tag>
              <Tag
                textColor="gray.500"
                background="gray.100"
                transition="background 0.4s ease"
                _groupHover={{
                  background: "transparent",
                }}
              >
                {membersCount} members
              </Tag>
              <Tag
                textColor="gray.500"
                background="gray.100"
                transition="background 0.4s ease"
                _groupHover={{
                  background: "transparent",
                }}
              >
                {`min: ${community.levels[0].accessRequirement.amount} ${community.chainData.ropsten.token.symbol}`}
              </Tag>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Link>
  )
}

export default CommunityCard
