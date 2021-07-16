import { useColorMode, Switch, Box, Icon } from "@chakra-ui/react"
import { Moon, Sun } from "phosphor-react"

const ColorModeSwitch = (): JSX.Element => {
  const { colorMode, setColorMode } = useColorMode()

  return (
    <Switch
      position="relative"
      mt={1}
      size="lg"
      id="color-mode"
      colorScheme="primary"
      isChecked={colorMode === "light"}
      onChange={(e) => setColorMode(e.target.checked ? "light" : "dark")}
    >
      <Box
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
        height="full"
        position="absolute"
        top="-1px"
        left={0}
      >
        <Icon as={Sun} weight="fill" color="white" transform="translateX(-50%)" />
        <Icon as={Moon} weight="fill" color="white" transform="translateX(0)" />
      </Box>
    </Switch>
  )
}

export default ColorModeSwitch
