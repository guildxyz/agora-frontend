import { Box, Button, Tooltip, useColorMode } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"
import { PropsWithChildren, useMemo } from "react"

type Props = {
  href: string
  disabled?: boolean
  tooltipText?: string
}

const PageButton = ({
  href,
  disabled = false,
  tooltipText = "Coming soon",
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const router = useRouter()
  const path = router.asPath.split("/")
  const currentPath = path.pop()
  const isActive = currentPath === href
  const { colorMode } = useColorMode()
  const gray = useMemo(
    () => (colorMode === "light" ? "gray.600" : "gray.400"),
    [colorMode]
  )

  return !disabled ? (
    <LinkButton
      href={`${path.join("/")}/${href}`}
      variant="ghost"
      isActive={isActive}
      color={(!isActive && gray) || undefined}
      minW="max-content"
    >
      {children}
    </LinkButton>
  ) : (
    <Tooltip label={tooltipText} placement="bottom">
      <Box>
        <Button variant="ghost" disabled color={gray}>
          {children}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default PageButton
