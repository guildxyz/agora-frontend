import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/admin/common/Section"
import { Chains } from "connectors"
import { UploadSimple } from "phosphor-react"
import { useEffect } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import slugify from "slugify"
import PhotoUploader from "../common/PhotoUploader"

const Details = (): JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext()
  const { chainId } = useWeb3React()

  const nameInput = useWatch({ name: "name" })
  const urlNameInput = useWatch({ name: "urlName" })

  const generatedUrlName = slugify(nameInput, {
    replacement: "-",
    lower: true,
    strict: true,
  })

  useEffect(() => setValue("chainName", Chains[chainId]), [chainId, setValue])

  const fillUrlName = () =>
    urlNameInput.length > 0 || setValue("urlName", generatedUrlName)

  return (
    <Section
      title="Details"
      description="General information about your community"
      cardType
    >
      <Grid templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }} gap={12}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", { required: true })}
              isInvalid={!!errors.name}
              onBlur={fillUrlName}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <InputGroup>
              <InputLeftAddon>app.agora.space/</InputLeftAddon>
              <Input
                {...register("urlName")}
                isInvalid={!!errors.urlName}
                placeholder={generatedUrlName}
              />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register("description")}
              isInvalid={!!errors.description}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Controller
              render={({ field, fieldState }) => (
                <PhotoUploader
                  ref={field.ref}
                  isInvalid={fieldState.invalid}
                  buttonIcon={UploadSimple}
                  buttonText="Change image"
                  onPhotoChange={(newPhoto: File) => field.onChange(newPhoto)}
                  {...field}
                />
              )}
              name="image"
              control={control}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </Section>
  )
}

export default Details
