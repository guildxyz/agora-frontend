import {
  CloseButton,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import Hint from "components/admin/common/Hint"
import PhotoUploader from "components/admin/common/PhotoUploader"
import Card from "components/common/Card"
import { Lock, LockOpen, LockSimpleOpen } from "phosphor-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Icon as IconType } from "temporaryData/types"
import RadioCard from "./RadioCard"

type MembershipData = {
  name: string
  icon: IconType
}

type MembershipTypes = "open" | "hold" | "stake"

const membershipsData: { [key: string]: MembershipData } = {
  open: {
    name: "Open",
    icon: LockSimpleOpen,
  },
  hold: {
    name: "Hold",
    icon: LockOpen,
  },
  stake: {
    name: "Stake",
    icon: Lock,
  },
}

type Props = {
  index: number // index is (and should be) only used for managing the form state / removing a level form the form!
  onRemove: () => void
}

const AddLevel = ({ index, onRemove }: Props): JSX.Element => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()

  const options = ["open", "hold", "stake"]
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "membership",
    defaultValue: options[0],
    onChange: (newValue: MembershipTypes) =>
      setValue(`levels.${index}.membershipRequirements.type`, newValue, {}),
  })

  const group = getRootProps()

  // Platform linking logic (temporary - we'Ll need to use some type of form management library, and store these values together with the other form control values)
  const [platformLinking, setPlatformLinking] = useState({
    tg: [],
    dc: [],
  })

  const tagsChange = (e, type: "tg" | "dc") => {
    if (e.code === "Comma" || e.code === "Enter") {
      const newItem = e.target.value.split(",")[0]

      if (newItem && !platformLinking[type].find((item) => item === newItem)) {
        const newList = [...platformLinking[type], newItem]
        setPlatformLinking({ ...platformLinking, [type]: newList })
        e.target.value = ""
      }
    }
  }

  const removeTag = (item: string, type: "tg" | "dc") => {
    const oldList = [...platformLinking[type]]
    const newList = oldList.filter((i) => i !== item)

    setPlatformLinking({ ...platformLinking, [type]: newList })
  }

  return (
    <Card position="relative" width="full" padding={8}>
      <CloseButton
        position="absolute"
        top={4}
        right={4}
        width={10}
        height={10}
        rounded="full"
        zIndex="docked"
        aria-label="Remove level"
        onClick={onRemove}
      />

      <VStack spacing={12}>
        <Grid
          width="full"
          templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }}
          gap={12}
        >
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                {...register(`levels.${index}.name`, { required: true })}
                isInvalid={errors.levels && !!errors.levels[index].name}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="level_image">
              <FormLabel>Image</FormLabel>
              <PhotoUploader buttonText="Change image..." />
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl id="community_description">
              <FormLabel>Description</FormLabel>
              <Textarea {...register(`levels.${index}.description`)} />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid
          width="full"
          templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }}
          gap={12}
        >
          <GridItem mb={-8} colSpan={{ base: 1, md: 2 }}>
            <Text as="h2" fontWeight="bold" fontSize="lg">
              Membership requirements
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl id="membership">
              <FormLabel>Membership</FormLabel>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={6}
                {...group}
              >
                {options.map((value) => {
                  const radio = getRadioProps({ value })
                  return (
                    <RadioCard key={value} {...radio}>
                      <HStack spacing={2} justify="center">
                        <Icon as={membershipsData[value].icon} />
                        <Text as="span">{membershipsData[value].name}</Text>
                      </HStack>
                    </RadioCard>
                  )
                })}
              </Stack>
              <Input
                type="hidden"
                {...register(`levels.${index}.membershipRequirements.type`, {
                  required: true,
                })}
                defaultValue={options[0]}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="amount">
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  {...register(
                    `levels.${index}.membershipRequirements.tokenAmount`,
                    {
                      required:
                        watch(`levels.${index}.membershipRequirements.type`) !==
                        "open",
                    }
                  )}
                  isDisabled={
                    watch(`levels.${index}.membershipRequirements.type`) === "open"
                  }
                  isInvalid={
                    errors.levels &&
                    !!errors.levels[index].membershipRequirements.tokenAmount
                  }
                />
                <InputRightAddon>TKN</InputRightAddon>
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="timelock">
              <FormLabel>Timelock</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  {...register(
                    `levels.${index}.membershipRequirements.tokenTimeLock`,
                    {
                      required:
                        watch(`levels.${index}.membershipRequirements.type`) ===
                        "stake",
                    }
                  )}
                  isDisabled={
                    watch(`levels.${index}.membershipRequirements.type`) !== "stake"
                  }
                  isInvalid={
                    errors.levels &&
                    !!errors.levels[index].membershipRequirements.tokenTimeLock
                  }
                />
                <InputRightAddon>month(s)</InputRightAddon>
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>

        <VStack width="full" spacing={6} alignItems="start">
          <Text as="h2" fontWeight="bold" fontSize="lg">
            Platform linking
          </Text>

          <FormControl id="tg_groups">
            <FormLabel>
              <Text as="span">Telegram group(s)</Text>
              <Hint header="Where can I find the TG group ID?" body="TODO..." />
            </FormLabel>
            <InputGroup>
              {platformLinking.tg.length > 0 && (
                <InputLeftAddon px={2} bgColor="transparent">
                  <HStack spacing={2}>
                    {platformLinking.tg.map((item) => (
                      <Tag key={item}>
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton onClick={() => removeTag(item, "tg")} />
                      </Tag>
                    ))}
                  </HStack>
                </InputLeftAddon>
              )}
              <Input
                width="full"
                placeholder="+ paste group ID"
                onKeyUp={(e) => tagsChange(e, "tg")}
              />
            </InputGroup>
          </FormControl>

          <FormControl id="dc_roles">
            <FormLabel>
              <Text as="span">Discord role(s)</Text>
              <Hint header="Where can I find the DC role ID?" body="TODO..." />
            </FormLabel>
            <InputGroup>
              {platformLinking.dc.length > 0 && (
                <InputLeftAddon px={2} bgColor="transparent">
                  <HStack spacing={2}>
                    {platformLinking.dc.map((item) => (
                      <Tag key={item}>
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton onClick={() => removeTag(item, "dc")} />
                      </Tag>
                    ))}
                  </HStack>
                </InputLeftAddon>
              )}
              <Input
                width="full"
                placeholder="+ paste Discord role ID"
                onKeyUp={(e) => tagsChange(e, "dc")}
              />
            </InputGroup>
          </FormControl>
        </VStack>
      </VStack>
    </Card>
  )
}

export default AddLevel
