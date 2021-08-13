import { Button, ButtonGroup, useColorMode } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

const LinkButton = ({ href, disabled = false, isAdminPage = false, children }) => {
  const router = useRouter()
  // Disabling ESLint rules cause it cries about the underscore variable incorrectly
  /* eslint-disable @typescript-eslint/naming-convention */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_, communityUrl, currentPath] = router.asPath.split("/")
  const isActive = currentPath === (href || undefined)
  const { colorMode } = useColorMode()
  const gray = useMemo(
    () => (colorMode === "light" ? "gray.600" : "gray.400"),
    [colorMode]
  )

  return (
    <Link
      key="href"
      passHref
      href={
        isAdminPage ? `/${communityUrl}/admin/${href}` : `/${communityUrl}/${href}`
      }
    >
      <Button
        as="a"
        colorScheme="primary"
        isActive={isActive}
        disabled={disabled}
        color={!isActive ? gray : undefined}
      >
        {children}
      </Button>
    </Link>
  )
}

const Pagination = ({ isAdminPage = false }) => (
  <ButtonGroup variant="ghost">
    <LinkButton href="" isAdminPage={isAdminPage}>
      Info
    </LinkButton>
    <LinkButton href="community" isAdminPage={isAdminPage}>
      Community
    </LinkButton>
    {/* <LinkButton href="twitter-bounty" disabled>
      Twitter bounty
    </LinkButton> */}
  </ButtonGroup>
)

export default Pagination
