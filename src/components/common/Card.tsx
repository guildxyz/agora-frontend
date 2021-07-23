/* eslint-disable react/jsx-props-no-spreading */
import { Box, useBreakpointValue, useColorMode } from "@chakra-ui/react"

type Props = {
  isFullWidthOnMobile?: boolean
  docked?: boolean
  variant?: "default" | "modern"
  children: JSX.Element | JSX.Element[]
  // for rest props
  [x: string]: any
}

const Card = ({
  isFullWidthOnMobile = false,
  docked = false,
  variant = "default",
  children,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box
      mx={isFullWidthOnMobile && { base: -4, sm: 0 }}
      bg={colorMode === "light" ? "white" : "gray.700"}
      border={variant === "modern" && "1px"}
      borderColor={
        variant === "modern" && (colorMode === "light" ? "gray.200" : "gray.600")
      }
      display="flex"
      flexDirection="column"
      // Docked
      position={docked && { base: "fixed", md: "relative" }}
      left={0}
      bottom={0}
      zIndex={docked ? "docked" : "auto"}
      py={docked && isMobile && 2}
      width={docked && { base: "full", md: "auto" }}
      borderRadius={
        docked
          ? { base: "none", md: "2xl" }
          : { base: isFullWidthOnMobile ? "none" : "2xl", sm: "2xl" }
      }
      shadow={
        (docked &&
          isMobile &&
          `0 -2px 5px 2px ${
            colorMode === "light"
              ? "var(--chakra-colors-blackAlpha-100)"
              : "var(--chakra-colors-blackAlpha-300)"
          }`) ||
        (variant === "modern" ? "none" : "md")
      }
      {...rest}
    >
      {children}
    </Box>
  )
}

export default Card
