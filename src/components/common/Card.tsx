/* eslint-disable react/jsx-props-no-spreading */
import { Box, useColorMode } from "@chakra-ui/react"

type Props = {
  isFullWidthOnMobile?: boolean
  type?: "default" | "modern"
  children: JSX.Element | JSX.Element[]
  // for rest props
  [x: string]: any
}

const Card = ({
  isFullWidthOnMobile = false,
  type = "default",
  children,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Box
      mx={isFullWidthOnMobile && { base: -4, sm: 0 }}
      borderRadius={{ base: isFullWidthOnMobile ? "none" : "2xl", sm: "2xl" }}
      bg={colorMode === "light" ? "white" : "gray.700"}
      shadow={type === "modern" ? "none" : "md"}
      border={type === "modern" && "1px"}
      borderColor={
        type === "modern" && (colorMode === "light" ? "gray.200" : "gray.600")
      }
      display="flex"
      flexDirection="column"
      {...rest}
    >
      {children}
    </Box>
  )
}

export default Card
