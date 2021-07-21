import {
  useColorMode,
  Button,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import InfoTags from "components/community/Levels/components/InfoTags"
import { Check, CheckCircle } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import type { Level as LevelType } from "temporaryData/types"
import StakingModal from "../StakingModal"
import AccessText from "./components/AccessText"
import useLevelAccess from "./hooks/useLevelAccess"
import useLevelDataMachine from "./hooks/useLevelDataMachine"

type Props = {
  data: LevelType
  index?: number
  onChangeHandler?: (levelData: LevelData) => void
}

type LevelData = {
  index: number
  isDisabled: boolean
  element: HTMLElement
  state?: "idle" | "focus" | "pending" | "access"
}

const Level = ({ data, index, onChangeHandler }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const {
    chainData: {
      token: { symbol: tokenSymbol },
    },
  } = useCommunity()
  const {
    isOpen: isStakingModalOpen,
    onOpen: onStakingModalOpen,
    onClose: onStakingModalClose,
  } = useDisclosure()
  const [hasAccess, noAccessMessage] = useLevelAccess(data.accessRequirement)

  const levelEl = useRef(null)
  const stakingBtn = useRef(null)

  const [levelData, setLevelData] = useState<LevelData>({
    index,
    isDisabled: true,
    element: null,
  })

  const [state, send] = useLevelDataMachine(hasAccess, isStakingModalOpen)

  // Setting up the elRef & registering the eventListeners
  useEffect(() => {
    const ref = levelEl.current

    setLevelData((prevState) => ({
      ...prevState,
      element: ref,
    }))

    const focusEnterHandler = () => {
      const btnFocusVisible = stakingBtn.current?.hasAttribute(
        "data-focus-visible-added"
      )
      if (btnFocusVisible) {
        send("FOCUSIN")
      }
    }

    const mouseEnterHandler = () => {
      send("MOUSEFOCUSIN")
    }

    const focusLeaveHandler = () => {
      send("FOCUSOUT")
    }

    ref.addEventListener("mouseenter", mouseEnterHandler)
    ref.addEventListener("mouseleave", focusLeaveHandler)
    ref.addEventListener("focusin", focusEnterHandler)
    ref.addEventListener("focusout", focusLeaveHandler)

    return () => {
      ref.removeEventListener("mouseenter", mouseEnterHandler)
      ref.removeEventListener("mouseleave", focusLeaveHandler)
      ref.removeEventListener("focusin", focusEnterHandler)
      ref.removeEventListener("focusout", focusLeaveHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelEl])

  // Update level
  useEffect(() => {
    setLevelData((prevState) => ({
      ...prevState,
      isDisabled: noAccessMessage.length > 0,
    }))
  }, [noAccessMessage])

  // If the state changes, send up the level data
  useEffect(() => {
    if (onChangeHandler) {
      onChangeHandler({ ...levelData, state: state.value })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelData, state])

  return (
    <Stack
      onClickCapture={(e) => {
        const rect = levelEl.current?.getBoundingClientRect()
        if (
          e.detail === 1 &&
          (e.clientX <= rect?.left ||
            e.clientX >= rect?.right ||
            e.clientY <= rect?.top ||
            e.clientY >= rect.bottom)
        ) {
          send("FORCEFOCUSOUT")
        }
      }}
      direction={{ base: "column", md: "row" }}
      spacing={6}
      py={{ base: 8, md: 10 }}
      borderBottom="1px"
      borderBottomColor={colorMode === "light" ? "gray.200" : "gray.600"}
      _last={{ borderBottom: 0 }}
      ref={levelEl}
    >
      <Grid
        width="full"
        templateColumns={{ base: "1fr auto", md: "auto 1fr" }}
        columnGap={{ base: 4, sm: 6 }}
        rowGap={6}
        alignItems="center"
      >
        <GridItem order={{ md: 1 }}>
          <Heading size="sm" mb="3">
            {data.name}
          </Heading>
          <InfoTags
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={tokenSymbol}
          />
        </GridItem>
        <GridItem order={{ md: 0 }}>
          <Image src={`${data.imageUrl}`} boxSize="45px" alt="Level logo" />
        </GridItem>
        {data.desc && (
          <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
            <Text fontSize="md">{data.desc}</Text>
          </GridItem>
        )}
      </Grid>

      <Stack
        direction={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "flex-end" }}
        justifyContent={{
          base: "space-between",
          md: "center",
        }}
      >
        {/* On mobile we use the Tag component to indicate level access state, on desktop AccessText.
            This is not nice, will refactor it to one component and handle the responsive styles there
            when we'll know exactly what we want design-wise */}
        {(hasAccess || noAccessMessage) && (
          <Tag
            display={{ base: "flex", md: "none" }}
            size="sm"
            colorScheme={hasAccess ? "green" : "gray"}
          >
            {hasAccess && <TagLeftIcon as={Check} />}
            <TagLabel>{hasAccess ? "You have access" : noAccessMessage}</TagLabel>
          </Tag>
        )}
        {hasAccess && (
          <AccessText
            text="You have access"
            icon={
              <Icon as={CheckCircle} color="green.600" weight="fill" boxSize={6} />
            }
          />
        )}
        {(() =>
          data.accessRequirement.type === "stake" &&
          !hasAccess && (
            <>
              <Button
                ref={stakingBtn}
                colorScheme="primary"
                fontWeight="medium"
                ml="auto"
                onClick={onStakingModalOpen}
                disabled={!!noAccessMessage}
              >
                Stake to join
              </Button>
              {!noAccessMessage && (
                <StakingModal
                  levelName={data.name}
                  accessRequirement={data.accessRequirement}
                  isOpen={isStakingModalOpen}
                  onClose={() => {
                    onStakingModalClose()
                    send("FOCUSOUT")
                  }}
                />
              )}
            </>
          ))()}
        {noAccessMessage && <AccessText text={noAccessMessage} />}
      </Stack>
    </Stack>
  )
}

export { Level }
export type { LevelData }
