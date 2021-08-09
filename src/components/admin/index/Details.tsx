import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
  Textarea,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { UploadSimple } from "phosphor-react"
import PhotoUploader from "../common/PhotoUploader"

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
          <PhotoUploader buttonIcon={UploadSimple} buttonText="Change image" />
        </FormControl>
      </GridItem>
    </Grid>
  </Section>
)

export default Details
