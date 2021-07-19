import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useColorMode } from "@chakra-ui/react"
import { LevelData } from "./Level"

type Props = { levelsState: { [x: number]: LevelData } }

const AccessIndicator = ({ levelsState }: Props) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const { colorMode } = useColorMode()
  const [accessHeight, setAccessHeight] = useState(0)
  const [pendingHeight, setPendingHeight] = useState(0)
  const [focusHeight, setFocusHeight] = useState(0)
  const [focusColor, setFocusColor] = useState("var(--chakra-colors-primary-500)")

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const levelsArray: LevelData[] = Object.values(levelsState)

    if (levelsArray.length === 0) {
      return
    }

    // TEMP - for testing
    /*
    if (levelsArray[1].element) {
      levelsArray[1].state = "pending"
    }
    */

    // Set the height of the access indicator
    const accessedLevels = levelsArray.filter(
      (level: LevelData) => level.state === "access"
    )

    let newAccessHeight = 0
    accessedLevels.forEach((level: LevelData) => {
      newAccessHeight += level.element.getBoundingClientRect().height
    })

    setAccessHeight(newAccessHeight)

    // Set the height of the pending indicator
    let pendingLevel = null
    pendingLevel = levelsArray.find((level: LevelData) => level.state === "pending")
    const newPendingHeight =
      pendingLevel?.element.getBoundingClientRect().bottom -
        pendingLevel?.element.parentElement.getBoundingClientRect().top -
        accessHeight || 0

    setPendingHeight(newPendingHeight)

    // Set the height of the focus indicator
    let focusLevel = null
    focusLevel = levelsArray.find((level: LevelData) => level.state === "focus")
    const newFocusHeight =
      focusLevel?.element.getBoundingClientRect().bottom -
        focusLevel?.element.parentElement.getBoundingClientRect().top -
        accessHeight -
        pendingHeight || 0

    setFocusHeight(newFocusHeight)

    // Set the indicator color
    const disabled = levelsArray.pop().isDisabled
    setFocusColor(
      disabled ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-primary-500)"
    )
  }, [windowSize, levelsState, accessHeight, colorMode])

  return (
    <>
      <motion.div
        style={{
          position: "absolute",
          top: accessHeight + pendingHeight,
          left: 0,
          height: 0,
          width: "6px",
          opacity: colorMode === "light" ? 0.3 : 0.4,
        }}
        transition={{ type: "just" }}
        animate={{
          height: focusHeight,
          background: focusColor,
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: accessHeight,
          left: 0,
          height: 0,
          width: "6px",
          opacity: 0.75,
          background: "var(--chakra-colors-primary-500)",
        }}
        transition={{ type: "just" }}
        animate={{
          height: pendingHeight,
        }}
      >
        <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
          <motion.div
            style={{
              position: "relative",
              top: 0,
              left: 0,
              width: "6px",
              height: pendingHeight,
              background: "trasparent",
              backgroundRepeat: "repeat-y",
              backgroundSize: "6px 6px",
              backgroundImage:
                "linear-gradient(-45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)",
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5,
              type: "tween",
            }}
            animate={{
              backgroundPositionY: "6px",
            }}
          />
        </div>
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 0,
          width: "6px",
          background: "var(--chakra-colors-primary-500)",
        }}
        transition={{ type: "just" }}
        animate={{
          height: accessHeight,
        }}
      />
    </>
  )
}

export default AccessIndicator
