import { useRef, useEffect } from "react"
import {
  Flex,
  Image,
  Heading,
  Stack,
  Button,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import { CheckCircle } from "phosphor-react"
import type { Level as LevelType } from "temporaryData/types"
import InfoTags from "components/community/Levels/components/InfoTags"
import StakingModal from "../StakingModal"
import useLevelAccess from "./hooks/useLevelAccess"

type Props = {
  data: LevelType
  onAccessChange?: (positionY: number) => void
  onHoverChange?: (positionY: number) => void
}

const Level = ({ data, onAccessChange, onHoverChange }: Props): JSX.Element => {
  const communityData = useCommunity()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [hasAccess, noAccessMessage] = useLevelAccess(data.accessRequirement)
  const levelEl = useRef(null)

  useEffect(() => {
    // If the user has access to this level, the component emits its height to the parent, so it can calculate the height of the active level access indicator
    if (hasAccess && onAccessChange) {
      onAccessChange(levelEl.current.offsetHeight)
    }
  }, [hasAccess, onAccessChange])

  const hoverChangeHandler = (isHover: boolean) => {
    // On hover, the component emits its position (bottom) to the parent, and this value will be the level access indicator's height until the end of the hover state
    if (onHoverChange && isHover && !hasAccess) {
      onHoverChange(levelEl.current.offsetTop + levelEl.current.offsetHeight)
    } else {
      onHoverChange(0)
    }
  }

  return (
    <Flex
      justifyContent="space-between"
      boxSizing="border-box"
      py="10"
      borderBottom="1px"
      borderBottomColor="gray.200"
      _last={{ borderBottom: 0 }}
      ref={levelEl}
      onMouseEnter={() => hoverChangeHandler(true)}
      onMouseLeave={() => hoverChangeHandler(false)}
    >
      <Stack direction="row" spacing="6">
        <Image src={`${data.imageUrl}`} boxSize="45px" alt="Level logo" />
        <Stack>
          <Heading size="sm">{data.name}</Heading>
          <InfoTags
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={communityData.chainData.token.symbol}
          />
          {data.desc && <Text pt="4">{data.desc}</Text>}
        </Stack>
      </Stack>
      <Stack alignItems="flex-end" justifyContent="center">
        {hasAccess && (
          <HStack spacing="3">
            <Text fontWeight="medium">You have access</Text>
            <CheckCircle
              color="var(--chakra-colors-green-500)"
              weight="fill"
              size="26"
            />
          </HStack>
        )}
        {!hasAccess && data.accessRequirement.type === "stake" && (
          <Button
            colorScheme="primary"
            fontWeight="medium"
            onClick={onOpen}
            disabled={!!noAccessMessage}
          >
            Stake to join
          </Button>
        )}
        {!hasAccess &&
          data.accessRequirement.type === "stake" &&
          !noAccessMessage && (
            <StakingModal
              name={data.name}
              accessRequirement={data.accessRequirement}
              {...{ isOpen, onClose }}
            />
          )}
        {noAccessMessage && <Text fontWeight="medium">{noAccessMessage}</Text>}
      </Stack>
    </Flex>
  )
}

export default Level
