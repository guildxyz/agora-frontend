import { Icon, IconButton, useColorMode } from "@chakra-ui/react"
import { Moon, Sun } from "phosphor-react"

const ColorModeSwitch = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Switch color mode"
      variant="ghost"
      borderRadius="2xl"
      icon={
        colorMode === "light" ? (
          <Icon as={Moon} weight="fill" />
        ) : (
          <Icon as={Sun} weight="fill" />
        )
      }
      onClick={toggleColorMode}
    />
  )
}

export default ColorModeSwitch
