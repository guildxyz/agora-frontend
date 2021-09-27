import Color from "color"
import { useMemo } from "react"

const lightness = 95
const darkness = 25
const darkSteps = 4
const lightSteps = 5

const LIGHTNESS_STEP = (lightness - 50) / lightSteps
const DARKNESS_STEP = (50 - darkness) / darkSteps

const LIGHT_SATURATE_STEP = 1 / lightSteps
const DARK_SATURATE_STEP = 1 / darkSteps

const useColorPalette = (
  prefix: string,
  colorCode: string
): { [x: string]: string } =>
  useMemo(
    () => ({
      [`--${prefix}-50`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP * 5)
        .saturate(LIGHT_SATURATE_STEP * 5)
        .hex(),
      [`--${prefix}-100`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP * 4)
        .saturate(LIGHT_SATURATE_STEP * 4)
        .hex(),
      [`--${prefix}-200`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP * 3)
        .saturate(LIGHT_SATURATE_STEP * 3)
        .hex(),
      [`--${prefix}-300`]: Color(colorCode)
        .lightness(50 + LIGHTNESS_STEP * 2)
        .saturate(LIGHT_SATURATE_STEP * 2)
        .hex(),
      [`--${prefix}-400`]: Color(colorCode)
        .lightness(50 + LIGHTNESS_STEP)
        .saturate(LIGHT_SATURATE_STEP * 1)
        .hex(),
      [`--${prefix}-500`]: Color(colorCode).lightness(50).hex(),
      [`--${prefix}-600`]: Color(colorCode)
        .lightness(50 - DARKNESS_STEP * 1)
        .saturate(DARK_SATURATE_STEP * 0.5)
        .hex(),
      [`--${prefix}-700`]: Color(colorCode)
        .lightness(45 - DARKNESS_STEP * 2)
        .saturate(DARK_SATURATE_STEP * 1)
        .hex(),
      [`--${prefix}-800`]: Color(colorCode)
        .lightness(45 - DARKNESS_STEP * 2.5)
        .saturate(DARK_SATURATE_STEP * 1.25)
        .hex(),
      [`--${prefix}-900`]: Color(colorCode)
        .lightness(45 - DARKNESS_STEP * 3)
        .saturate(DARK_SATURATE_STEP * 1.5)
        .hex(),
    }),
    [prefix, colorCode]
  )

export default useColorPalette
