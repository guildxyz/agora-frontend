import { Icon, Text, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useRouter } from "next/router"
import type { Icon as IconType } from "temporaryData/types"

export type SideNavItem = {
  name: string
  path: string
  icon: IconType
}

type Props = {
  sideNavItems?: SideNavItem[]
}

const SideNav = ({ sideNavItems }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const router = useRouter()

  return (
    <nav>
      {sideNavItems.map((link: SideNavItem) => (
        <Link
          key={link.name.toLowerCase()}
          href={link.path}
          px={4}
          mb={2}
          bgColor={
            (router.pathname === link.path &&
              (colorMode === "light" ? "white" : "gray.700")) ||
            "transparent"
          }
          boxShadow={router.pathname === link.path ? "base" : "none"}
          width="full"
          height={12}
          display="flex"
          alignItems="center"
          borderRadius="md"
          fontWeight="semibold"
          textColor={router.pathname === link.path ? "indigo.600" : "black"}
          _hover={{
            textDecoration: "none",
            bgColor:
              (router.pathname === link.path &&
                (colorMode === "light" ? "white" : "gray.700")) ||
              (colorMode === "light" ? "gray.200" : "whiteAlpha.100"),
          }}
        >
          <Icon as={link.icon} color={colorMode === "light" ? "black" : "white"} />
          <Text
            as="span"
            marginLeft={2}
            color={colorMode === "light" ? "black" : "white"}
          >
            {link.name}
          </Text>
        </Link>
      ))}
    </nav>
  )
}

export default SideNav
