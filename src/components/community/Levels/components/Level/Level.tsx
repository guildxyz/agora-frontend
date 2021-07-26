import {
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
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react"
import InfoTags from "components/community/Levels/components/InfoTags"
import { Check, CheckCircle } from "phosphor-react"
import { useEffect } from "react"
import StakingModal from "../StakingModal"
import AccessText from "./components/AccessText"
import { useLevelData } from "./Context"
import useLevelAccess from "./hooks/useLevelAccess"
import useLevelIndicatorState from "./hooks/useLevelIndicatorState"

type Props = {
  setLevelsState: any
}

const Level = ({ setLevelsState }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const {
    isOpen: isStakingModalOpen,
    onOpen: onStakingModalOpen,
    onClose: onStakingModalClose,
  } = useDisclosure()
  const {
    requirementAmount,
    requirementType,
    requirementTimelockMs,
    name,
    membersCount,
    imageUrl,
    description,
  } = useLevelData()

  const [hasAccess, noAccessMessage] = useLevelAccess(
    requirementType,
    requirementAmount
  )
  const [hoverElRef, focusElRef, state] = useLevelIndicatorState(
    hasAccess,
    isStakingModalOpen
  )

  // If the state changes, send up the level data
  useEffect(() => {
    setLevelsState((prevState) => ({
      ...prevState,
      [name]: {
        isDisabled: noAccessMessage.length > 0,
        element: hoverElRef.current,
        state,
      },
    }))
  }, [noAccessMessage, state, hoverElRef, setLevelsState, name])

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={6}
      py={{ base: 8, md: 10 }}
      borderBottom="1px"
      borderBottomColor={colorMode === "light" ? "gray.200" : "gray.600"}
      _last={{ borderBottom: 0 }}
      ref={hoverElRef}
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
            {name}
          </Heading>
          <InfoTags />
        </GridItem>
        <GridItem order={{ md: 0 }}>
          <Image src={`${imageUrl}`} boxSize="45px" alt="Level logo" />
        </GridItem>
        {description && (
          <GridItem colSpan={{ base: 2, md: 1 }} colStart={{ md: 2 }} order={2}>
            <Text fontSize="md">{description}</Text>
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
          requirementType === "STAKE" &&
          !hasAccess && (
            <>
              <Button
                ref={focusElRef}
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
                  isOpen={isStakingModalOpen}
                  onClose={onStakingModalClose}
                />
              )}
            </>
          ))()}
        {noAccessMessage && <AccessText text={noAccessMessage} />}
      </Stack>
    </Stack>
  )
}

export default Level
