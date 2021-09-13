import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { useFormContext } from "react-hook-form"

const Links = (): JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useFormContext()

  const urlChange = (e, field: string) => {
    if (!e.target.value || e.target.value.length < 7) return

    // Remove the http/https from the string
    setValue(field, e.target.value.replace("http://", "").replace("https://", ""))
  }

  return (
    <Section
      title="Links"
      description="Links to other platforms to show on your communitiy’s page"
      cardType
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={12}>
        <GridItem>
          <FormControl id="github">
            <FormLabel>Github</FormLabel>
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                {...register("links[0].url")}
                onChange={(e) => urlChange(e, "links[0].url")}
              />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="medium">
            <FormLabel>Medium</FormLabel>
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                {...register("links[1].url")}
                onChange={(e) => urlChange(e, "links[1].url")}
              />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="twitter">
            <FormLabel>Twitter</FormLabel>
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                {...register("links[2].url")}
                onChange={(e) => urlChange(e, "links[2].url")}
              />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl id="reddit">
            <FormLabel>Reddit</FormLabel>
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                {...register("links[3].url")}
                onChange={(e) => urlChange(e, "links[3].url")}
              />
            </InputGroup>
          </FormControl>
        </GridItem>
      </Grid>
    </Section>
  )
}

export default Links
