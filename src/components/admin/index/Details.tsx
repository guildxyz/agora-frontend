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
import { Controller, useFormContext } from "react-hook-form"
import PhotoUploader from "../common/PhotoUploader"

const Details = (): JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Section
      title="Details"
      description="General information about your community"
      cardType
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={12}>
        <GridItem>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", { required: true })}
              isInvalid={!!errors.name}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <InputGroup>
              <Input
                {...register("url", { required: true })}
                isInvalid={!!errors.url}
              />
              <InputRightAddon>.agora.space</InputRightAddon>
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register("description", { required: true })}
              isInvalid={!!errors.description}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
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
              name="photo"
              control={control}
              rules={{ required: true }}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </Section>
  )
}

export default Details
