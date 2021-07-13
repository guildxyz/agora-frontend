import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CommunityCard from "components/allCommunities/CommunityCard"
import { Community } from "temporaryData/types"

type Props = {
  title: string
  communities: Community[]
  placeholder?: string
}

const CategorySection = ({
  title,
  communities,
  placeholder,
}: Props): JSX.Element => {
  const { account, library } = useWeb3React()

  const isConnected = typeof account === "string" && !!library

  return (
    <Stack spacing={4}>
      <Heading size="md" as="h4">
        {title}
      </Heading>

      {!isConnected && <div>Wallet not connected</div>}

      {isConnected &&
        (communities.length ? (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
            {communities.map((i) => (
              <CommunityCard community={i} key={i.id} />
            ))}
          </SimpleGrid>
        ) : (
          <Text>{placeholder}</Text>
        ))}
    </Stack>
  )
}

export default CategorySection
