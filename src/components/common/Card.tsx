/* eslint-disable react/jsx-props-no-spreading */
import { Box, useColorMode } from "@chakra-ui/react"

type Props = {
  isFullWidthOnMobile?: boolean
  variant?: "default" | "modern"
  children: JSX.Element | JSX.Element[]
  // for rest props
  [x: string]: any
}

const Card = ({
  isFullWidthOnMobile = false,
  variant = "default",
  children,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Box
      mx={isFullWidthOnMobile && { base: -4, sm: 0 }}
      borderRadius={{ base: isFullWidthOnMobile ? "none" : "2xl", sm: "2xl" }}
      bg={colorMode === "light" ? "white" : "gray.700"}
      shadow={variant === "modern" ? "none" : "md"}
      border={variant === "modern" && "1px"}
      borderColor={
        variant === "modern" && (colorMode === "light" ? "gray.200" : "gray.600")
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
