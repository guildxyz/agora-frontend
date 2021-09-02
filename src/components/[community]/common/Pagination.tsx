import { Box, Button, HStack, Tooltip, useColorMode } from "@chakra-ui/react"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useSpaceFactory from "components/admin/hooks/useSpaceFactory"
import Link from "next/link"
import { useRouter } from "next/router"
import { CheckCircle } from "phosphor-react"
import { useEffect, useMemo, useRef, useState } from "react"
import useFactoryMachine from "../hooks/useFactoryMachine"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

type LinkButtonProps = {
  variant?: string
  href: string
  disabled?: boolean
  size?: string
  doneBtn?: boolean
  children: any
}

type PaginationProps = {
  doneBtnUrl?: string
  editBtnUrl?: string
  isAdminPage?: boolean
  isCommunityTabDisabled?: boolean
  saveBtnLoading?: boolean
  onSaveClick?: () => void
  hasStakingLevel?: boolean
}

const LinkButton = ({
  variant = "ghost",
  href,
  disabled = false,
  size = "md",
  doneBtn = false,
  children,
}: LinkButtonProps): JSX.Element => {
  const router = useRouter()
  const [, communityUrl, ...currentPath] = router.asPath.split("/")
  const fullHref = currentPath.includes("admin")
    ? (href.length > 0 && `admin/${href}`) || "admin"
    : href
  const isActive = !doneBtn && currentPath.join("/") === fullHref
  const { colorMode } = useColorMode()
  const gray = useMemo(
    () => (colorMode === "light" ? "gray.600" : "gray.400"),
    [colorMode]
  )

  return (
    <Link key="href" passHref href={`/${communityUrl}/${doneBtn ? href : fullHref}`}>
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
  isCommunityTabDisabled = false,
  saveBtnLoading = false,
  onSaveClick = null,
  hasStakingLevel = false,
}: PaginationProps): JSX.Element => {
  const router = useRouter()
  const paginationRef = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const { colorMode } = useColorMode()
  const [state, send] = useFactoryMachine()
  const { communityData } = useCommunityData()
  const { contractAddress } = useSpaceFactory(communityData?.chainData.token.address)
  const hasContract =
    typeof contractAddress === "string" && contractAddress !== ZERO_ADDRESS
  const [, , ...currentPath] = router.asPath.split("/")
  const isCommunityAdminPage =
    currentPath.includes("admin") && currentPath.includes("community")

  useEffect(() => {
    const handleScroll = () => {
      const current = paginationRef.current || null
      const rect = current?.getBoundingClientRect()

      // When the Pagination component becomes "sticky"...
      setIsSticky(rect?.top === 0)
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
        bgColor: colorMode === "light" ? "white" : "gray.800",
        boxShadow: "md",
        transition: "0.2s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
    >
      <LinkButton href="" size="md">
        Info
      </LinkButton>

      <Tooltip
        label="You have to save general info of your token first"
        placement="bottom"
        isDisabled={!isCommunityTabDisabled}
      >
        <Box>
          <LinkButton
            href={!isCommunityTabDisabled ? "community" : "#"}
            size="md"
            disabled={isCommunityTabDisabled}
          >
            Community
          </LinkButton>
        </Box>
      </Tooltip>

      <HStack spacing={3} marginInlineStart="auto!important">
        {!hasContract &&
          isCommunityAdminPage &&
          hasStakingLevel &&
          (() => {
            switch (state.value) {
              case "idle":
              case "error":
                return (
                  <Button
                    variant="solid"
                    colorScheme="primary"
                    size="md"
                    onClick={() => send("DEPLOY")}
                  >
                    Deploy contract
                  </Button>
                )
              case "success":
                return (
                  <Button
                    isDisabled
                    variant="outline"
                    colorScheme="primary"
                    size="md"
                    rightIcon={<CheckCircle />}
                  >
                    Deployed
                  </Button>
                )
              default:
                return (
                  <Button isLoading variant="solid" colorScheme="primary" size="md">
                    Deploying
                  </Button>
                )
            }
          })()}

        {isAdminPage && onSaveClick && (
          <Button
            isDisabled={!hasContract}
            isLoading={saveBtnLoading}
            variant="solid"
            colorScheme="primary"
            size="md"
            onClick={onSaveClick}
          >
            Save
          </Button>
        )}

        {isAdminPage && !onSaveClick && (
          <LinkButton
            disabled={!hasContract}
            doneBtn
            variant="solid"
            href={doneBtnUrl}
          >
            Done
          </LinkButton>
        )}

        {editBtnUrl && (
          <LinkButton variant="solid" href={editBtnUrl}>
            Edit
          </LinkButton>
        )}
      </HStack>

      {/* <LinkButton href="twitter-bounty" disabled>
      Twitter bounty
    </LinkButton> */}
    </HStack>
  )
}

export default Pagination
