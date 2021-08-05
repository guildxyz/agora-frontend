import { Icon, Text } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Gear, PaintBrushBroad, Stack } from "phosphor-react"

const SideNav = () => (
  <nav>
    <Link
      href="/admin/settings/general"
      px={4}
      mb={2}
      width="full"
      height={12}
      bgColor="white"
      boxShadow="base"
      display="flex"
      alignItems="center"
      borderRadius="md"
      fontWeight="semibold"
      textColor="indigo.600"
      _hover={{
        textDecoration: "none",
      }}
    >
      <Icon as={Gear} />
      <Text as="span" marginLeft={2}>
        General
      </Text>
    </Link>

    <Link
      href="/admin/settings/levels"
      px={4}
      mb={2}
      width="full"
      height={12}
      display="flex"
      alignItems="center"
      borderRadius="md"
      fontWeight="semibold"
      _hover={{
        textDecoration: "none",
        bgColor: "gray.200",
      }}
    >
      <Icon as={Stack} />
      <Text as="span" marginLeft={2}>
        Levels
      </Text>
    </Link>

    <Link
      href="/admin/settings/appearance"
      px={4}
      mb={2}
      width="full"
      height={12}
      display="flex"
      alignItems="center"
      borderRadius="md"
      fontWeight="semibold"
      _hover={{
        textDecoration: "none",
        bgColor: "gray.200",
      }}
    >
      <Icon as={PaintBrushBroad} />
      <Text as="span" marginLeft={2}>
        Appearance
      </Text>
    </Link>
  </nav>
)

export default SideNav
