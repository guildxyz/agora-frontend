import { Box, Button, HStack, Icon } from "@chakra-ui/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { Icon as IconType } from "temporaryData/types"

type Props = {
  buttonIcon?: IconType
  buttonText?: string
  currentImage?: string
}

const PhotoUploader = ({
  buttonIcon,
  buttonText,
  currentImage,
}: Props): JSX.Element => {
  const fileInputRef = useRef()
  const [pickedPhoto, setPickedPhoto] = useState<File>()
  const [photoPreview, setPhotoPreview] = useState(currentImage)

  // Needed for displaying blob files
  const customImageLoader = ({ src }) => `${src}`

  const fileInputClick = () => {
    const fileInput = fileInputRef.current || null
    fileInput?.click()
  }

  const fileInputChange = (e) => {
    setPickedPhoto(e.target.files[0])
  }

  // Set up the preview image
  useEffect(() => {
    if (pickedPhoto) {
      setPhotoPreview(URL.createObjectURL(pickedPhoto))
    }
  }, [pickedPhoto])

  return (
    <HStack spacing={4}>
      {photoPreview ? (
        <Box
          position="relative"
          width={10}
          height={10}
          borderRadius="full"
          overflow="hidden"
        >
          <Image
            loader={customImageLoader}
            src={photoPreview}
            alt="Placeholder"
            layout="fill"
          />
        </Box>
      ) : (
        <Box width={10} height={10} rounded="full" bgColor="gray.100" />
      )}

      <Button
        leftIcon={buttonIcon && <Icon as={buttonIcon} />}
        variant="outline"
        borderWidth={1}
        rounded="md"
        size="sm"
        px={6}
        height={10}
        onClick={fileInputClick}
      >
        {buttonText || "Upload image"}
      </Button>

      <input
        type="file"
        style={{ display: "none" }}
        accept="image/png, image/jpeg"
        onChange={fileInputChange}
        ref={fileInputRef}
      />
    </HStack>
  )
}

export default PhotoUploader
