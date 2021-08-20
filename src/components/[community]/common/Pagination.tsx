import {
  Box,
  Button,
  HStack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

const LinkButton = ({ href, disabled = false, size = "md", children }) => {
  const router = useRouter()
  const [, communityUrl, ...currentPath] = router.asPath.split("/")
  const isActive = currentPath.join("/") === href
  const { colorMode } = useColorMode()
  const gray = useMemo(
    () => (colorMode === "light" ? "gray.600" : "gray.400"),
    [colorMode]
  )

  return (
    <Link key="href" passHref href={`/${communityUrl}/${href}`}>
      <Button
        as="a"
        variant="ghost"
        colorScheme="primary"
        isActive={isActive}
        disabled={disabled}
        color={!isActive ? gray : undefined}
        size={size}
      >
        {children}
      </Button>
    </Link>
  )
}

const Pagination = ({ isAdminPage = false }) => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })

  return (
    <HStack>
      <LinkButton href={isAdminPage ? "admin" : ""} size={buttonSize}>
        Info
      </LinkButton>
      <LinkButton
        href={isAdminPage ? "admin/community" : "community"}
        size={buttonSize}
      >
        Community
      </LinkButton>

      {isAdminPage && (
        <Box marginInlineStart="auto!important">
          <LinkButton href="" size={buttonSize}>
            Back to community
          </LinkButton>
        </Box>
      )}

      {/* <LinkButton href="twitter-bounty" disabled>
      Twitter bounty
    </LinkButton> */}
    </HStack>
  )
}

export default Pagination
