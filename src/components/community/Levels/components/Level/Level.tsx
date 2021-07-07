import { useRef, useState, useEffect } from "react"
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  HStack,
  Text,
  useDisclosure,
  Tooltip,
  Icon,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import InfoTags from "components/community/Levels/components/InfoTags"
import { CheckCircle, XCircle } from "phosphor-react"
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
  const communityData = useCommunity()
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure()
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
    if (!isModalOpen && levelData.status === "focus") {
      setLevelData((prevState) => ({
        ...prevState,
        status: hasAccess ? "access" : "idle",
      }))
    }
  }, [isModalOpen])

  useEffect(() => {
    if (isModalOpen && levelData.status !== "focus") {
      setLevelData((prevState) => ({
        ...prevState,
        status: "focus",
      }))
    }

    if (onChangeHandler) {
      onChangeHandler(levelData)
    }
  }, [levelData, isModalOpen])

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
    <Flex
      justifyContent="space-between"
      alignItems={{ base: "flex-start", md: "center" }}
      direction={{ base: "column", md: "row" }}
      boxSizing="border-box"
      py="10"
      borderBottom="1px"
      borderBottomColor="gray.200"
      _last={{ borderBottom: 0 }}
      ref={levelEl}
    >
      <Stack
        direction="row"
        flex="1"
        spacing={{ base: 4, sm: 6 }}
        mb={{ base: 6, md: 0 }}
      >
        <Image
          src={`${data.imageUrl}`}
          boxSize={{ base: "40px", sm: "45px" }}
          alt="Level logo"
        />
        <Stack>
          <Heading size="sm">
            <HStack>
              <span>{data.name}</span>
              {noAccessMessage && (
                <Tooltip label={noAccessMessage}>
                  <Icon
                    as={XCircle}
                    tabIndex={0}
                    display={{ base: "block", md: "none" }}
                    color="var(--chakra-colors-orange-400)"
                    weight="fill"
                    w={6}
                    h={6}
                  />
                </Tooltip>
              )}
              {hasAccess && (
                <Tooltip label="You have access">
                  <Icon
                    as={CheckCircle}
                    tabIndex={0}
                    display={{ base: "block", md: "none" }}
                    color="var(--chakra-colors-green-500)"
                    weight="fill"
                    w={6}
                    h={6}
                  />
                </Tooltip>
              )}
            </HStack>
          </Heading>
          <InfoTags
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={communityData.chainData.token.symbol}
          />
          {data.desc && (
            <Text fontSize={{ base: "sm", sm: "md" }} pt={{ base: 0, md: 4 }}>
              {data.desc}
            </Text>
          )}
        </Stack>
      </Stack>
      <Stack
        width={{ base: "full", md: "auto" }}
        alignItems={{ base: "flex-start", sm: "flex-end" }}
        justifyContent="center"
      >
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
        {noAccessMessage && (
          <AccessText
            text={noAccessMessage}
            icon={
              <Icon
                as={XCircle}
                color="var(--chakra-colors-orange-400)"
                weight="fill"
                w={6}
                h={6}
              />
            }
          />
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
              isOpen={isModalOpen}
              onClose={onClose}
            />
          )}
      </Stack>
    </Flex>
  )
}

export { Level }
export type { LevelData }
