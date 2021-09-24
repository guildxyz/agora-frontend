import { Box, HStack, Stack, useColorMode } from "@chakra-ui/react"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import PageButton from "./components/PageButton"

type PaginationProps = {
  isRegister?: boolean
}

const Pagination = ({
  isRegister = false,
  children,
}: PropsWithChildren<PaginationProps>): JSX.Element => {
  const paginationRef = useRef()
  const [isSticky, setIsSticky] = useState(false)
  const { colorMode } = useColorMode()

  useEffect(() => {
    const handleScroll = () => {
      const current = paginationRef.current || null
      const rect = current?.getBoundingClientRect()

      setIsSticky(rect?.top === 0)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Stack
      ref={paginationRef}
      direction="row"
      spacing="14"
      justifyContent="space-between"
      position="sticky"
      top={0}
      py="3"
      my="-3"
      width="full"
      zIndex={isSticky ? "banner" : "auto"}
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        // button height + padding
        height: "calc(var(--chakra-space-11) + (2 * var(--chakra-space-3)))",
        bgColor: colorMode === "light" ? "white" : "gray.800",
        boxShadow: "md",
        transition: "opacity 0.2s ease, visibility 0.1s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
    >
      <Box
        position="relative"
        mx={-4}
        minW="0"
        sx={{
          "-webkit-mask-image":
            "linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent)",
        }}
      >
        <HStack
          overflowX="auto"
          px={4}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          <PageButton href={isRegister ? "register" : "info"}>Info</PageButton>
          <PageButton
            href="community"
            disabled={isRegister}
            tooltipText="You have to save general info of your token first"
          >
            Community
          </PageButton>
          <PageButton href="#" disabled>
            Gamification
          </PageButton>
          <PageButton href="#" disabled>
            Trustless Payment
          </PageButton>
          <PageButton href="#" disabled>
            Feeless Voting
          </PageButton>
        </HStack>
      </Box>

      {children && <Box>{children}</Box>}
    </Stack>
  )
}

export default Pagination
