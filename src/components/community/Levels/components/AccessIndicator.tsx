import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type LevelData = {
  index: number
  status: "idle" | "access" | "focus"
  isDisabled: boolean
  element: HTMLElement
}

type Props = { levelsState: { [x: number]: LevelData } }

const AccessIndicator = ({ levelsState }) => {
  const [accessLevelHeight, setAccessLevelHeight] = useState(0)
  const [hoverLevelHeight, setHoverLevelHeight] = useState(0)
  const [hoverColor, setHoverColor] = useState("var(--chakra-colors-primary-100)")

  useEffect(() => {
    const levelsArray: LevelData[] = Object.values(levelsState)

    if (levelsArray.length === 0) {
      return
    }

    // Set the height of the first indicator
    const accessedLevels = levelsArray.filter(
      (level: LevelData) => level.status === "access"
    )

    let newAccessHeight = 0
    accessedLevels.forEach((level: LevelData) => {
      newAccessHeight += level.element.getBoundingClientRect().height
    })

    setAccessLevelHeight(newAccessHeight)

    // Set the height of the second indicator
    let hoverLevel = null
    hoverLevel = levelsArray.find((level: LevelData) => level.status === "focus")
    const newHoverHeight =
      hoverLevel?.element.getBoundingClientRect().bottom -
        hoverLevel?.element.parentElement.getBoundingClientRect().top -
        accessLevelHeight || 0

    setHoverLevelHeight(newHoverHeight)

    // Set the indicator color
    const disabled = levelsArray.pop().isDisabled
    setHoverColor(
      disabled ? "var(--chakra-colors-gray-100)" : "var(--chakra-colors-primary-100)"
    )
  }, [levelsState])

  return (
    <>
      <motion.div
        style={{
          position: "absolute",
          top: accessLevelHeight,
          left: 0,
          height: 0,
          width: "6px",
        }}
        transition={{ type: "just" }}
        animate={{
          height: hoverLevelHeight,
          background: hoverColor,
        }}
      />
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
          height: accessLevelHeight,
        }}
      />
    </>
  )
}

export default AccessIndicator
