import { Box } from "@chakra-ui/react"

type Props = {
  hoverLevelPos: number
  highestLevelPos: number
}

const AccessIndicator = ({ hoverLevelPos, highestLevelPos }: Props): JSX.Element => (
  <Box
    pos="absolute"
    top="0"
    left="0"
    w="6px"
    h={`${hoverLevelPos || highestLevelPos}px`}
    bgGradient={`linear-gradient(to bottom, var(--chakra-colors-primary-500) ${highestLevelPos}px, var(--chakra-colors-primary-100) ${highestLevelPos}px, var(--chakra-colors-primary-100) 100%)`}
    transition="height 0.2s linear"
  />
)

export default AccessIndicator
