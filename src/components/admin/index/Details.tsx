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
import Section from "components/admin/common/Section"
import { UploadSimple } from "phosphor-react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import slugify from "slugify"
import PhotoUploader from "../common/PhotoUploader"
import ValidationError from "../common/ValidationError"
import UsedToken from "./UsedToken"

type Props = {
  isAdminPage?: boolean
}

const Details = ({ isAdminPage = false }: Props): JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useFormContext()

  const nameInput = useWatch({ name: "name" })
  const urlNameInput = useWatch({ name: "urlName" })

  const generatedUrlName =
    nameInput &&
    slugify(nameInput, {
      replacement: "-",
      lower: true,
      strict: true,
    })

  const nameOnBlur = () => {
    trigger("name")
    if (urlNameInput?.length <= 0) {
      setValue("urlName", generatedUrlName)
      trigger("urlName")
    }
  }

  return (
    <Section
      title="Details"
      description="General information about your community"
      cardType
    >
      <Grid templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }} gap={12}>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <UsedToken />
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", { required: "This field is required." })}
              isInvalid={errors.name}
              onBlur={nameOnBlur}
            />
          </FormControl>
          <ValidationError fieldName="name" />
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <InputGroup>
              <InputLeftAddon>app.agora.space/</InputLeftAddon>
              {isAdminPage ? (
                <Input {...register("urlName")} disabled />
              ) : (
                <Input
                  {...register("urlName", {
                    maxLength: {
                      value: 20,
                      message:
                        "The maximum possible URL name length is 20 characters",
                    },
                    validate: async (value) => {
                      try {
                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_API}/community/urlName/${value}`
                        )
                        if (!response.ok)
                          console.info(
                            "%cThe logged error is expected, it's needed for validating the url name input field.",
                            "color: gray"
                          )
                        return !response.ok || "This url name is already in use."
                      } catch {
                        return "Failed to validate."
                      }
                    },
                  })}
                  isInvalid={errors.urlName}
                  placeholder={generatedUrlName}
                />
              )}
            </InputGroup>
          </FormControl>
          <ValidationError fieldName="urlName" />
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea {...register("description")} isInvalid={errors.description} />
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
                  isDisabled
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
