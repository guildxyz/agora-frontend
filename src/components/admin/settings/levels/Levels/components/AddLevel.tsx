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
  InputLeftElement,
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
import { useState } from "react"
import placeholderPic from "../../../../../../../public/temporaryCommunityLogos/agora.png"
import CustomRadio from "./CustomRadio"

const MemberShipIcons = { open: LockSimpleOpen, hold: LockOpen, stake: Lock }

const AddLevel = () => {
  // Well need a cleaner solution for these radio buttons & values
  const memberships = ["open", "hold", "stake"]

  const [selectedMembership, setSelectedMembership] = useState(0)

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "membership",
    defaultValue: "open",
    onChange: (selected) => setSelectedMembership(+selected),
  })

  const radioGroup = getRootProps()

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
              <HStack {...radioGroup}>
                {memberships.map((value) => {
                  const radio = getRadioProps({ value })
                  radio.checked = +value === selectedMembership
                  return (
                    <CustomRadio key={value} {...radio}>
                      <HStack justify="center">
                        <Icon as={MemberShipIcons[value]} />
                        <Text>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
                      </HStack>
                    </CustomRadio>
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
              {/* Should fix the width of this element! */}
              <InputLeftElement width="max-content">
                <HStack px={2} spacing={2}>
                  <Tag>
                    <TagLabel>Ethane insiders</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </HStack>
              </InputLeftElement>
              <Input width="full" />
            </InputGroup>
          </FormControl>

          <FormControl id="tg_groups">
            <FormLabel>Telegram group(s)</FormLabel>
            <InputGroup>
              {/* Should fix the width of this element! */}
              <InputLeftElement width="max-content">
                <HStack px={2} spacing={2}>
                  <Tag>
                    <TagLabel>Ethane insiders</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </HStack>
              </InputLeftElement>
              <Input width="full" />
            </InputGroup>
          </FormControl>
        </VStack>
      </VStack>
    </Card>
  )
}

export default AddLevel
