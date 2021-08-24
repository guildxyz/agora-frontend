import {
  Box,
  Button,
  HStack,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"

type LinkButtonProps = {
  variant?: string
  href: string
  disabled?: boolean
  size?: string
  children: any
}

type PaginationProps = {
  doneBtnUrl?: string
  editBtnUrl?: string
  isAdminPage?: boolean
  saveBtnLoading?: boolean
  onSaveClick?: () => void
}

const LinkButton = ({
  variant = "ghost",
  href,
  disabled = false,
  size = "md",
  children,
}: LinkButtonProps): JSX.Element => {
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

const Pagination = ({
  doneBtnUrl = "",
  editBtnUrl = null,
  isAdminPage = false,
  saveBtnLoading = false,
  onSaveClick = null,
}: PaginationProps): JSX.Element => {
  const paginationRef = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })

  useEffect(() => {
    const handleScroll = () => {
      const current = paginationRef.current || null
      const rect = current?.getBoundingClientRect()

      // When the Pagination component becomes "sticky"...
      setIsSticky(rect.top === 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <HStack
      ref={paginationRef}
      position="sticky"
      top={0}
      py={isSticky ? 2 : 0}
      height={isSticky ? 16 : 12}
      zIndex={isSticky ? "banner" : "auto"}
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        height: 16,
        bgColor: "white",
        boxShadow: "md",
        transition: "opacity 0.2s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
    >
      <LinkButton href={isAdminPage ? "admin" : ""} size={buttonSize}>
        Info
      </LinkButton>
      <LinkButton
        href={isAdminPage ? "admin/community" : "community"}
        size={buttonSize}
      >
        Community
      </LinkButton>

      {isAdminPage && onSaveClick && (
        <Box marginInlineStart="auto!important">
          <Button
            isLoading={saveBtnLoading}
            variant="solid"
            colorScheme="green"
            onClick={onSaveClick}
          >
            Save
          </Button>
        </Box>
      )}

      {isAdminPage && !onSaveClick && (
        <Box marginInlineStart="auto!important">
          <LinkButton variant="solid" href={doneBtnUrl}>
            Done
          </LinkButton>
        </Box>
      )}

      {editBtnUrl && (
        <Box marginInlineStart="auto!important">
          <LinkButton variant="solid" href={editBtnUrl}>
            Edit
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
