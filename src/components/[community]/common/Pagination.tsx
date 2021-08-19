import {
  Button,
  ButtonGroup,
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
    <ButtonGroup variant="ghost">
      <LinkButton href={isAdminPage ? "admin" : ""} size={buttonSize}>
        Info
      </LinkButton>
      <LinkButton
        href={isAdminPage ? "admin/community" : "community"}
        size={buttonSize}
      >
        Community
      </LinkButton>
      {/* <LinkButton href="twitter-bounty" disabled>
      Twitter bounty
    </LinkButton> */}
    </ButtonGroup>
  )
}

export default Pagination
