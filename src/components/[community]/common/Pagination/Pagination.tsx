import { Box, HStack, Stack, Tooltip, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useCommunityData from "components/admin/hooks/useCommunityData"
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

  const { account } = useWeb3React()
  const { communityData } = useCommunityData()

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
    <Stack
      ref={paginationRef}
      position="sticky"
      top={0}
      width="full"
      height={{
        base:
          communityData?.owner?.addresses?.some(
            ({ address }) => address === account?.toLowerCase()
          ) || isRegister
            ? 36
            : 16,
        md: 16,
      }}
      zIndex={isSticky ? "banner" : "auto"}
      _before={{
        content: `""`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "full",
        height: {
          base:
            communityData?.owner?.addresses?.some(
              ({ address }) => address === account?.toLowerCase()
            ) || isRegister
              ? 36
              : 16,
          md: 16,
        },
        bgColor: colorMode === "light" ? "white" : "gray.800",
        boxShadow: "md",
        transition: "0.2s ease",
        visibility: isSticky ? "visible" : "hidden",
        opacity: isSticky ? 1 : 0,
      }}
      direction={{ base: "column", md: "row" }}
    >
      <Box
        mt={isSticky ? 2 : 0}
        mx={{ base: -4, md: 0 }}
        position="relative"
        overflow="hidden"
        height={{
          base: communityData?.owner?.addresses?.some(
            ({ address }) => address === account?.toLowerCase()
          )
            ? 36
            : 16,
          md: 16,
        }}
      >
        <Box
          mb={4}
          maxWidth={{ base: "100vw", md: "auto" }}
          overflowX="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: 0,
            },
            "&::-webkit-scrollbar-track": {
              width: 0,
            },
            "&::-webkit-scrollbar-thumb": {
              width: 0,
            },
          }}
        >
          <HStack pl={{ base: 4, md: 0 }}>
            <PageButton href={isRegister ? "register" : "info"}>Info</PageButton>

            <Tooltip
              label="You have to save general info of your token first"
              placement="bottom"
              isDisabled={!isRegister}
            >
              <Box>
                <PageButton href="community" disabled={isRegister}>
                  Community
                </PageButton>
              </Box>
            </Tooltip>

            <Tooltip label="Coming soon" placement="bottom">
              <Box>
                <PageButton href="#" disabled>
                  Gamification
                </PageButton>
              </Box>
            </Tooltip>

            <Tooltip label="Coming soon" placement="bottom">
              <Box>
                <PageButton href="#" disabled>
                  Trustless Payment
                </PageButton>
              </Box>
            </Tooltip>

            <Tooltip label="Coming soon" placement="bottom">
              <Box>
                <PageButton href="#" disabled>
                  Feeless Voting
                </PageButton>
              </Box>
            </Tooltip>

            {/* <LinkButton href="twitter-bounty" disabled>
        Twitter bounty
      </LinkButton> */}
          </HStack>
        </Box>
        <Box
          display={{ base: "block", md: "none" }}
          visibility={isSticky ? "visible" : "hidden"}
          opacity={isSticky ? 1 : 0}
          position="absolute"
          top={0}
          left={0}
          width={8}
          height="full"
          bgGradient={`linear(to-r, ${
            colorMode === "light" ? "white" : "gray.800"
          }, transparent)`}
        />
        <Box
          display={{ base: "block", md: "none" }}
          visibility={isSticky ? "visible" : "hidden"}
          opacity={isSticky ? 1 : 0}
          position="absolute"
          top={0}
          right={0}
          width={8}
          height="full"
          bgGradient={`linear(to-l, ${
            colorMode === "light" ? "white" : "gray.800"
          }, transparent)`}
        />
      </Box>
      <Box
        pt={isSticky ? { base: 0, md: 2 } : 0}
        width="max-content"
        marginInlineStart="auto!important"
      >
        {children}
      </Box>
    </Stack>
  )
}

export default Pagination
