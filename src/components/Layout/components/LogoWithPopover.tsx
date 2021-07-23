import {
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react"
import { Link } from "components/common/Link"
import Logo from "./Logo"

const links = [
  {
    text: "Explorer",
    href: "/",
  },
  {
    text: "About",
    href: "/",
  },
  {
    text: "Code",
    href: "/",
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
              {link.text}
            </Link>
          ))}
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)

export default LogoWithPopover
