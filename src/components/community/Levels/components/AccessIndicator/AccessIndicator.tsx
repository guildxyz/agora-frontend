import { Box, BoxProps, useColorMode } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useState } from "react"
import useIndicatorHeight from "./hooks/useIndicatorHeight"
import LevelState from "./types"

const MotionBox = motion<BoxProps>(Box)

const Indicator = ({ ...rest }: { [x: string]: any }) => (
  <MotionBox
    pos="absolute"
    left="0"
    width="6px"
    height="0"
    transition={{ type: "just" }}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  />
)

type Props = {
  levelsState: { [x: string]: LevelState }
}

const AccessIndicator = ({ levelsState }: Props) => {
  const { colorMode } = useColorMode()
  const [focusColor, setFocusColor] = useState("var(--chakra-colors-primary-500)")
  const { accessHeight, focusHeight, pendingHeight } = useIndicatorHeight(
    levelsState,
    setFocusColor
  )

  return (
    <>
      <Indicator
        top={accessHeight + pendingHeight}
        opacity={colorMode === "light" ? 0.3 : 0.4}
        animate={{
          height: focusHeight,
          background: focusColor,
        }}
      />
      <Indicator
        top={accessHeight}
        bg="primary.500"
        opacity="0.7"
        animate={{
          height: pendingHeight,
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          height: { type: "just" },
          opacity: {
            repeat: Infinity,
            duration: 1,
            type: "tween",
          },
        }}
      />
      <Indicator
        top="0"
        bg="primary.500"
        animate={{
          height: accessHeight,
        }}
      />
    </>
  )
}

export default AccessIndicator
export type { LevelState }
