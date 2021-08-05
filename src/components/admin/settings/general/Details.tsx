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
  InputRightAddon,
  Textarea,
} from "@chakra-ui/react"
import Section from "components/admin/Section"
import Image from "next/image"
import { UploadSimple } from "phosphor-react"
import placeholderPic from "../../../../../public/temporaryCommunityLogos/agora.png"

const Details = (): JSX.Element => (
  <Section
    title="Details"
    description="General information about your community"
    cardType
  >
    <Grid templateColumns="repeat(2, 1fr)" gap={12}>
      <GridItem>
        <FormControl id="community_name">
          <FormLabel>Name</FormLabel>
          <Input />
        </FormControl>
      </GridItem>

      <GridItem>
        <FormControl id="community_url">
          <FormLabel>URL</FormLabel>
          <InputGroup>
            <Input />
            <InputRightAddon>.agora.space</InputRightAddon>
          </InputGroup>
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl id="community_description">
          <FormLabel>Description</FormLabel>
          <Textarea />
        </FormControl>
      </GridItem>

      <GridItem colSpan={2}>
        <FormControl id="community_image">
          <FormLabel>Image</FormLabel>
          <HStack spacing={4}>
            <Image src={placeholderPic} alt="Placeholder" width={40} height={40} />
            <Button
              leftIcon={<Icon as={UploadSimple} />}
              variant="outline"
              borderWidth={1}
              rounded="md"
              size="sm"
              px={6}
              height={10}
            >
              Change image
            </Button>
          </HStack>
        </FormControl>
      </GridItem>
    </Grid>
  </Section>
)

export default Details
