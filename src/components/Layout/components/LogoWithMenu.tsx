import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { Code, Info, MagnifyingGlass } from "phosphor-react"
import Logo from "./Logo"

// Maybe I should add types to this array later..
const links = [
  {
    text: "Explorer",
    href: "/",
    icon: <MagnifyingGlass />,
  },
  {
    text: "About",
    href: "https://agora.space/",
    icon: <Info />,
  },
  {
    text: "Code",
    href: "https://github.com/AgoraSpaceDAO",
    icon: <Code />,
  },
]

const LogoWithMenu = () => (
  <Menu>
    <MenuButton
      as={IconButton}
      aria-label="Agora logo"
      variant="ghost"
      isRound
      width={10}
      height={10}
    >
      <Logo width="1m" height="1em" />
    </MenuButton>
    <MenuList border="none" shadow="md">
      {links.map((link) => (
        <MenuItem as="a" key={link.href} href={link.href} icon={link.icon}>
          {link.text}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
)

export default LogoWithMenu
