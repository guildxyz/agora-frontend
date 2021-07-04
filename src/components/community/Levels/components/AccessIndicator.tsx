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

  useEffect(() => {
    const levelsArray = Object.values(levelsState)

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
        transition={{ type: "spring" }}
        animate={{
          height: hoverLevelHeight,
          background: "var(--chakra-colors-primary-100)",
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
        transition={{ type: "spring" }}
        animate={{
          height: accessLevelHeight,
        }}
      />
    </>
  )
}

export default AccessIndicator
