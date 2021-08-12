import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Section from "components/admin/common/Section"
import requestNetworkChange from "components/common/Layout/components/Account/components/NetworkModal/utils/requestNetworkChange"
import { Chains, supportedChains } from "connectors"
import { UploadSimple } from "phosphor-react"
import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import PhotoUploader from "../common/PhotoUploader"

const Details = (): JSX.Element => {
  const {
    control,
    watch,
    register,
    formState: { errors },
    setValue,
  } = useFormContext()
  const { chainId } = useWeb3React()

  useEffect(() => setValue("chainName", Chains[chainId]), [chainId, setValue])

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
                placeholder={watch("name")?.toLowerCase().replace(/ /g, "-") || ""}
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
          <FormControl isRequired>
            <FormLabel>Chain</FormLabel>
            <Select
              defaultValue={Chains[chainId]}
              placeholder="Select chain"
              {...register("chainName", { required: true })}
              isInvalid={!!errors.chainName}
              onChange={(event) => requestNetworkChange(event.target.value)()}
            >
              {supportedChains.map((chainName) => (
                <option key={Chains[chainName]} value={chainName}>
                  {chainName}
                </option>
              ))}
            </Select>
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
