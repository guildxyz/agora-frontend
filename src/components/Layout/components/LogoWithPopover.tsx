import {
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Link } from "components/common/Link"
import { Code, Info, MagnifyingGlass } from "phosphor-react"
import Logo from "./Logo"

// Maybe I should add types to this array later..
const links = [
  {
    text: "Explorer",
    href: "/",
    icon: MagnifyingGlass,
  },
  {
    text: "About",
    href: "/",
    icon: Info,
  },
  {
    text: "Code",
    href: "/",
    icon: Code,
  },
]

const LogoWithPopover = () => (
  <Popover placement="right-start">
    <PopoverTrigger>
      <IconButton aria-label="Agora logo" variant="ghost" isRound>
        <Logo width="1em" height="1em" />
      </IconButton>
    </PopoverTrigger>
    <PopoverContent width="max-content" border="none" shadow="md">
      <PopoverBody px={0} py={2}>
        <VStack alignItems="flex-start">
          {links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              px={4}
              py={1}
              w="full"
              height={8}
              _hover={{
                textDecoration: "none",
                background: "blackAlpha.100",
              }}
            >
              <Flex alignItems="center" justifyContent="space-between" width="full">
                <Text as="span" mr={4}>
                  {link.text}
                </Text>
                <Icon as={link.icon} />
              </Flex>
            </Link>
          ))}
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)

export default LogoWithPopover
