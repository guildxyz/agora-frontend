import { createContext, useEffect, useState, useContext } from "react"
import { Chains } from "connectors"
import { useWeb3React } from "@web3-react/core"
import type { ProvidedCommunity, Community } from "temporaryData/types"
import { Box } from "@chakra-ui/react"
import chroma from "chroma-js"

type Props = {
  data: Community
  children: JSX.Element
}

const CommunityContext = createContext<ProvidedCommunity | null>(null)

const CommunityProvider = ({ data, children }: Props): JSX.Element => {
  const { chainId } = useWeb3React()
  const [communityData, setCommunityData] = useState<ProvidedCommunity>({
    ...data,
    chainData: data.chainData[Object.keys(data.chainData)[0]],
  })
  const [generatedColors, setGeneratedColors] = useState({})

  useEffect(() => {
    if (chainId) {
      setCommunityData({
        ...data,
        chainData: data.chainData[Chains[chainId]],
      })
    }
  }, [chainId, data])

  // Generating color palette - maybe I should place the implementation in another file? (KovJonas)
  useEffect(() => {
    let inputColor = chroma(communityData.theme.color)
    const originalInputColorHex = inputColor.hex("rgb")
    const inputLightness = inputColor.get("hsl.l")
    const inputSaturation = inputColor.get("hsl.s")

    // Correction if needed
    if (inputLightness > 0.75) {
      const darkenAmount =
        inputSaturation < 0.6 ? inputSaturation : 2 / inputLightness
      inputColor = inputColor.darken(darkenAmount)
    } else if (inputLightness > 0.35) {
      const darkenAmount =
        inputSaturation < 0.6 ? inputSaturation : 1 / inputLightness
      inputColor = inputColor.darken(darkenAmount)
    }

    // This will be the darkened color
    const inputColorHex = inputColor.hex("rgb")

    // Generate 11 (#ffffff + 10) colors between pure white and the input color
    const generated = chroma
      .scale(["white", originalInputColorHex, inputColorHex.replace("#", "")])
      .correctLightness()
      .colors(11)

    // Just drop the first value, it'll be white always
    generated.shift()

    setGeneratedColors({
      "--chakra-colors-primary-50": generated[0],
      "--chakra-colors-primary-100": generated[1],
      "--chakra-colors-primary-200": generated[2],
      "--chakra-colors-primary-300": generated[3],
      "--chakra-colors-primary-400": generated[4],
      "--chakra-colors-primary-500": generated[5],
      "--chakra-colors-primary-600": generated[6],
      "--chakra-colors-primary-700": generated[7],
      "--chakra-colors-primary-800": generated[8],
      "--chakra-colors-primary-900": generated[9],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CommunityContext.Provider value={communityData}>
      <Box sx={{ ...generatedColors }}>{children}</Box>
    </CommunityContext.Provider>
  )
}

const useCommunity = (): ProvidedCommunity => useContext(CommunityContext)

export { useCommunity, CommunityProvider }
