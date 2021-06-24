import { useState } from "react"
import { Link } from "components/common/Link"
import type { Community } from "temporaryData/communities"
import { Box, LinkBox, LinkOverlay, Image, Heading, Stack } from "@chakra-ui/react"
import Card from "../common/Card"
import InfoTags from "../common/InfoTags"

type Props = {
  community: Community
}

const CommunityCard = ({ community }: Props): JSX.Element => {
  const [hover, setHover] = useState(false)

  const membersCount = community.levels
    .map((level) => level.membersCount)
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  return (
    <LinkBox
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/${community.urlName}`} _hover={{ textDecor: "none" }}>
        <LinkOverlay>
          <Card pos="relative" p="8" overflow="hidden">
            <Box
              pos="absolute"
              top="0"
              left={hover ? "0%" : "100%"}
              width="100%"
              height="100%"
              bgGradient={`linear(to-l, ${community.theme.color}, white)`}
              opacity="0.2"
              transition="all 0.2s ease"
            />
            <Stack position="relative" direction="row" spacing="10">
              <Image src={`${community.imageUrl}`} boxSize="45px" alt="Level logo" />
              <Stack>
                <Heading size="sm">{community.name}</Heading>

                <InfoTags
                  type="community"
                  membersCount={membersCount}
                  // TODO: get message count from the DB
                  messagesCount={0}
                  tokenSymbol={community.chainData.ropsten.token.symbol}
                />
              </Stack>
            </Stack>
          </Card>
        </LinkOverlay>
      </Link>
    </LinkBox>
  )
}

export default CommunityCard
