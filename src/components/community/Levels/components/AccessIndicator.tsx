// import { Box } from "@chakra-ui/react"
import { motion } from "framer-motion"

type Props = {
  hoverLevelPos: number
  highestLevelPos: number
}

const AccessIndicator = ({ hoverLevelPos, highestLevelPos }: Props): JSX.Element => (
  <motion.div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "6px",
      height: 0,
      background: `linear-gradient(to bottom, var(--chakra-colors-primary-500) ${highestLevelPos}px, var(--chakra-colors-primary-100) ${highestLevelPos}px, var(--chakra-colors-primary-100) 100%)`,
    }}
    transition={{
      type: "spring",
      duration: 0.5,
    }}
    animate={{
      height: `${hoverLevelPos || highestLevelPos}px`,
    }}
  />
)

export default AccessIndicator
