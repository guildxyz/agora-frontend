/* eslint-disable react-hooks/exhaustive-deps */
// I disabled it manually, because the AccessIndicator works properly with the current dependency list, and the other dependencies shouldn't be added - KovJonas
import { useRef, useState, useEffect } from "react"
import {
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  VStack,
  Text,
  useDisclosure,
  Icon,
  Tag,
  TagLeftIcon,
  TagLabel,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import InfoTags from "components/community/Levels/components/InfoTags"
import { Check, CheckCircle } from "phosphor-react"
import type { Level as LevelType } from "temporaryData/types"
import StakingModal from "../StakingModal"
import useLevelAccess from "./hooks/useLevelAccess"
import AccessText from "./components/AccessText"

type Props = {
  data: LevelType
  index?: number
  onChangeHandler?: (levelData: LevelData) => void
}

type LevelData = {
  index: number
  status: "idle" | "access" | "focus"
  isDisabled: boolean
  element: HTMLElement
}

const Level = ({ data, index, onChangeHandler }: Props): JSX.Element => {
  const {
    chainData: {
      token: { symbol: tokenSymbol },
    },
    theme,
  } = useCommunity()
  const {
    isOpen: isStakingModalOpen,
    onOpen: onStakingModalOpen,
    onClose: onStakingModalClose,
  } = useDisclosure()
  const [hasAccess, noAccessMessage] = useLevelAccess(data.accessRequirement)

  const levelEl = useRef(null)
  const [levelData, setLevelData] = useState<LevelData>({
    index,
    status: "idle",
    isDisabled: true,
    element: null,
  })

  useEffect(() => {
    const ref = levelEl.current

    const mouseEnterHandler = () => {
      setLevelData((prevState) => ({
        ...prevState,
        status: prevState.status === "access" ? "access" : "focus",
      }))
    }

    const mouseLeaveHandler = () => {
      setLevelData((prevState) => ({
        ...prevState,
        status: prevState.status === "access" ? "access" : "idle",
      }))
    }

    ref.addEventListener("mouseenter", mouseEnterHandler)
    ref.addEventListener("mouseleave", mouseLeaveHandler)

    return () => {
      ref.removeEventListener("mouseenter", mouseEnterHandler)
      ref.removeEventListener("mouseleave", mouseLeaveHandler)
    }
  }, [])

  useEffect(() => {
    setLevelData((prevState) => ({
      ...prevState,
      status: hasAccess ? "access" : "idle",
      isDisabled: noAccessMessage.length > 0,
      element: levelEl.current,
    }))
  }, [hasAccess, noAccessMessage, levelEl])

  useEffect(() => {
    if (!isStakingModalOpen && levelData.status === "focus") {
      setLevelData((prevState) => ({
        ...prevState,
        status: hasAccess ? "access" : "idle",
      }))
    }
  }, [isStakingModalOpen])

  useEffect(() => {
    if (isStakingModalOpen && levelData.status !== "focus") {
      setLevelData((prevState) => ({
        ...prevState,
        status: "focus",
      }))
    }

    if (onChangeHandler) {
      onChangeHandler(levelData)
    }
  }, [levelData, isStakingModalOpen])

  // If the level access changes while the modal is opened
  useEffect(() => {
    if (levelData.status === "focus" && hasAccess) {
      setLevelData((prevState) => ({
        ...prevState,
        status: "access",
      }))
    }

    if (onChangeHandler) {
      onChangeHandler(levelData)
    }
  }, [hasAccess])

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={{ base: 4, sm: 6 }}
      boxSizing="border-box"
      py={{ base: 8, md: 10 }}
      borderBottom="1px"
      borderBottomColor="gray.200"
      _last={{ borderBottom: 0 }}
      ref={levelEl}
    >
      <Grid
        position="relative"
        width="full"
        templateRows="auto auto"
        templateColumns={{ base: "1fr 45px", md: "45px 1fr" }}
        columnGap={{ base: 4, sm: 6 }}
        rowGap={2}
      >
        <GridItem
          order={{ base: 2, md: 1 }}
          colSpan={{ base: 0, md: 1 }}
          rowSpan={2}
        >
          <Image
            position={{ base: "absolute", md: "relative" }}
            top="0"
            right="0"
            src={`${data.imageUrl}`}
            boxSize="45px"
            alt="Level logo"
          />
        </GridItem>
        <GridItem order={{ base: 1, md: 2 }}>
          <Heading size="sm">{data.name}</Heading>
        </GridItem>
        <GridItem
          order={{ base: 2, md: 3 }}
          colSpan={{ base: 2, md: 1 }}
          pr={{ base: 8, md: 0 }}
        >
          <InfoTags
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={tokenSymbol}
          />
          {data.desc && (
            <Text fontSize="md" pt={4}>
              {data.desc}
            </Text>
          )}
        </GridItem>
      </Grid>

      <Stack
        direction={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "flex-end" }}
        justifyContent={{
          base: hasAccess || noAccessMessage ? "space-between" : "flex-end",
          md: "flex-end",
        }}
      >
        {(hasAccess || noAccessMessage) && (
          <Tag
            display={{ base: "flex", md: "none" }}
            size="sm"
            colorScheme={hasAccess ? "green" : "blackAlpha"}
          >
            {hasAccess && <TagLeftIcon as={Check} />}
            <TagLabel>{hasAccess ? "You have access" : noAccessMessage}</TagLabel>
          </Tag>
        )}

        {hasAccess && (
          <AccessText
            text="You have access"
            icon={
              <Icon
                as={CheckCircle}
                color="var(--chakra-colors-green-500)"
                weight="fill"
                w={6}
                h={6}
              />
            }
          />
        )}
        {noAccessMessage && <AccessText text={noAccessMessage} />}
        {!hasAccess && data.accessRequirement.type === "stake" && (
          <Button
            colorScheme="primary"
            fontWeight="medium"
            onClick={onStakingModalOpen}
            disabled={!!noAccessMessage}
          >
            Stake to join
          </Button>
        )}
        {!hasAccess &&
          data.accessRequirement.type === "stake" &&
          !noAccessMessage && (
            <StakingModal
              levelName={data.name}
              accessRequirement={data.accessRequirement}
              isOpen={isStakingModalOpen}
              onClose={onStakingModalClose}
            />
          )}
      </Stack>
    </Stack>
  )
}

export { Level }
export type { LevelData }
