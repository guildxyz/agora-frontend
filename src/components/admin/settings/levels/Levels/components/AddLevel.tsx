import {
  Button,
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
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useRadioGroup,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import Image from "next/image"
import { Lock, LockOpen, LockSimpleOpen } from "phosphor-react"
import { Icon as IconType } from "temporaryData/types"
import placeholderPic from "../../../../../../../public/temporaryCommunityLogos/agora.png"
import RadioCard from "./RadioCard"

type MembershipData = {
  name: string
  icon: IconType
}

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

const AddLevel = () => {
  const options = ["open", "hold", "stake"]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "membership",
    defaultValue: "open",
    onChange: console.log,
  })

  const group = getRootProps()

  return (
    <Card width="full" padding={8}>
      <VStack spacing={12}>
        <Grid width="full" templateColumns="repeat(2, 1fr)" gap={12}>
          <GridItem>
            <FormControl id="level_name">
              <FormLabel>Name</FormLabel>
              <Input />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="level_image">
              <FormLabel>Image</FormLabel>
              <HStack spacing={4}>
                <Image
                  src={placeholderPic}
                  alt="Placeholder"
                  width={40}
                  height={40}
                />
                <Button
                  variant="outline"
                  borderWidth={1}
                  rounded="md"
                  size="sm"
                  px={6}
                  height={10}
                >
                  Change image...
                </Button>
              </HStack>
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl id="community_description">
              <FormLabel>Description</FormLabel>
              <Textarea />
            </FormControl>
          </GridItem>
        </Grid>

        <Grid width="full" templateColumns="repeat(2, 1fr)" gap={12}>
          <GridItem mb={-8} colSpan={2}>
            <Text as="h2" fontWeight="bold" fontSize="lg">
              Membership requirements
            </Text>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl id="membership">
              <FormLabel>Membership</FormLabel>
              <HStack {...group}>
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
              </HStack>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="amount">
              <FormLabel>Amount</FormLabel>
              <InputGroup>
                <Input />
                <InputRightAddon>TKN</InputRightAddon>
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl id="timelock">
              <FormLabel>Timelock</FormLabel>
              <InputGroup>
                <Input />
                <InputRightAddon>month</InputRightAddon>
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>

        <VStack width="full" spacing={6} alignItems="start">
          <Text as="h2" fontWeight="bold" fontSize="lg">
            Platform linking
          </Text>

          <FormControl id="tg_groups">
            <FormLabel>Telegram group(s)</FormLabel>
            <InputGroup>
              <InputLeftAddon px={2} bgColor="transparent">
                <HStack spacing={2}>
                  <Tag>
                    <TagLabel>Ethane insiders</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </HStack>
              </InputLeftAddon>
              <Input width="full" />
            </InputGroup>
          </FormControl>

          <FormControl id="tg_groups">
            <FormLabel>Discord channel(s)</FormLabel>
            <InputGroup>
              <InputLeftAddon px={2} bgColor="transparent">
                <HStack spacing={2}>
                  <Tag>
                    <TagLabel>general</TagLabel>
                    <TagCloseButton />
                  </Tag>
                  <Tag>
                    <TagLabel>help</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </HStack>
              </InputLeftAddon>
              <Input width="full" />
            </InputGroup>
          </FormControl>
        </VStack>
      </VStack>
    </Card>
  )
}

export default AddLevel
