import { useRef, useEffect, useCallback } from "react"
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
  onAccessChange?: (levelName: string, positionY: number) => void
  onHoverChange?: (positionY: number) => void
}

const Level = ({ data, onAccessChange, onHoverChange }: Props): JSX.Element => {
  const communityData = useCommunity()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [hasAccess, noAccessMessage] = useLevelAccess(data.accessRequirement)
  const levelEl = useRef(null)

  useEffect(() => {
    if (!onAccessChange) {
      return
    }

    if (hasAccess) {
      onAccessChange(data.name, levelEl.current.offsetHeight)
    } else {
      onAccessChange(data.name, 0)
    }
  }, [hasAccess, onAccessChange, data.name])

  const hoverChangeHandler = useCallback(
    (isHover: boolean) => {
      if (onHoverChange && isHover && !hasAccess) {
        onHoverChange(levelEl.current.offsetTop + levelEl.current.offsetHeight)
      } else {
        onHoverChange(0)
      }
    },
    [hasAccess, onHoverChange]
  )

  // Need to register native mouse events, because the React mouse events aren't working as expected when we use a disabled input in a div. (https://github.com/facebook/react/issues/10396)
  useEffect(() => {
    if (!levelEl) {
      return
    }

    const ref = levelEl.current
    const hoverInHandler = () => hoverChangeHandler(true)
    const hoverOutHandler = () => {
      if (!isOpen) {
        hoverChangeHandler(false)
      }
    }

    ref.addEventListener("mouseenter", hoverInHandler)
    ref.addEventListener("mouseleave", hoverOutHandler)

    return () => {
      ref.removeEventListener("mouseenter", hoverInHandler)
      ref.removeEventListener("mouseleave", hoverOutHandler)
    }
  }, [hoverChangeHandler, isOpen])

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      boxSizing="border-box"
      py="10"
      borderBottom="1px"
      borderBottomColor="gray.200"
      _last={{ borderBottom: 0 }}
      ref={levelEl}
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
