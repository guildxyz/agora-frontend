// import { Box } from "@chakra-ui/react"
import { motion } from "framer-motion"

type Props = {
  hoverLevelPos: number
  highestLevelPos: number
  isNextLevelOk: boolean
}

const AccessIndicator = ({
  hoverLevelPos,
  highestLevelPos,
  isNextLevelOk,
}: Props): JSX.Element => (
  <>
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 0,
        width: "6px",
      }}
      transition={{ type: "just" }}
      animate={{
        height: hoverLevelPos,
        background: isNextLevelOk
          ? "var(--chakra-colors-primary-100)"
          : "var(--chakra-colors-gray-200)",
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
        height: highestLevelPos,
      }}
    />
  </>
)

export default AccessIndicator
