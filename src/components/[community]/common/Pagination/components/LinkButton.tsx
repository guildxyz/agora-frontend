import { Button, useColorMode } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { PropsWithChildren, useMemo } from "react"

type Props = {
  isAdminPage?: boolean
  variant?: string
  href: string
  disabled?: boolean
  size?: string
}

const LinkButton = ({
  isAdminPage = false,
  variant = "ghost",
  href,
  disabled = false,
  size = "md",
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const router = useRouter()
  const [, communityUrl, ...currentPath] = router.asPath.split("/")
  const isActive = currentPath.filter((str) => str !== "admin").join("/") === href
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
        variant={variant}
        colorScheme="primary"
        isActive={isActive}
        disabled={disabled}
        color={(!isActive && (variant === "solid" ? "white" : gray)) || undefined}
        size={size}
      >
        {children}
      </Button>
    </Link>
  )
}

export default LinkButton
