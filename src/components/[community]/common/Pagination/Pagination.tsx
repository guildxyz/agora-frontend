import { Box, HStack, Stack, Tooltip, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useCommunityData from "components/admin/hooks/useCommunityData"
import { PropsWithChildren, useEffect, useRef, useState } from "react"
import PageButton from "./components/PageButton"

type PaginationProps = {
  isAdminPage?: boolean
  isCommunityTabDisabled?: boolean
}

const Pagination = ({
  isAdminPage = false,
  isCommunityTabDisabled = false,
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
      py={isSticky ? 2 : 0}
      width="full"
      height={{
        base: communityData?.owner?.addresses?.some(
          ({ address }) => address === account?.toLowerCase()
        )
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
          base: communityData?.owner?.addresses?.some(
            ({ address }) => address === account?.toLowerCase()
          )
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
      <Box mx={{ base: -4, md: 0 }} position="relative">
        <Box mb={4} maxWidth={{ base: "100vw", md: "auto" }} overflowX="auto">
          <HStack pl={{ base: 4, md: 0 }}>
            <PageButton isAdminPage={isAdminPage} href="">
              Info
            </PageButton>

            <Tooltip
              label="You have to save general info of your token first"
              placement="bottom"
              isDisabled={!isCommunityTabDisabled}
            >
              <Box>
                <PageButton
                  isAdminPage={isAdminPage}
                  href="community"
                  disabled={isCommunityTabDisabled}
                >
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
          visibility={isSticky ? "visible" : "hidden"}
          opacity={isSticky ? 1 : 0}
          position="absolute"
          top={0}
          left={0}
          width={8}
          height="full"
          bgGradient="linear(to-r, gray.800, transparent)"
        />
        <Box
          visibility={isSticky ? "visible" : "hidden"}
          opacity={isSticky ? 1 : 0}
          position="absolute"
          top={0}
          right={0}
          width={8}
          height="full"
          bgGradient="linear(to-l, gray.800, transparent)"
        />
      </Box>
      <Box width="max-content" marginInlineStart="auto!important">
        {children}
      </Box>
    </Stack>
  )
}

export default Pagination
