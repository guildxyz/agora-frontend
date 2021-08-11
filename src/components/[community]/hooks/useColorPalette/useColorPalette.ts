import Color from "color"
import { useMemo } from "react"
import {
  DARKNESS_STEP,
  DARK_ROTATE_STEP,
  DARK_SATURATE_STEP,
  LIGHTNESS_STEP,
  LIGHT_ROTATE_STEP,
  LIGHT_SATURATE_STEP,
} from "./constants"

const useColorPalette = (
  prefix: string,
  colorCode: string
): { [x: string]: string } =>
  useMemo(
    () => ({
      [`--${prefix}-50`]: Color(colorCode)
        .lightness(48 + LIGHTNESS_STEP * 5.6)
        .rotate(LIGHT_ROTATE_STEP * 5)
        .saturate(LIGHT_SATURATE_STEP * 10)
        .hex(),
      [`--${prefix}-100`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP * 4.6)
        .rotate(LIGHT_ROTATE_STEP * 4)
        .saturate(LIGHT_SATURATE_STEP * 4)
        .hex(),
      [`--${prefix}-200`]: Color(colorCode)
        .lightness(54 + LIGHTNESS_STEP * 4)
        .rotate(LIGHT_ROTATE_STEP * 3)
        .saturate(LIGHT_SATURATE_STEP * 3)
        .hex(),
      [`--${prefix}-300`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP * 3)
        .rotate(LIGHT_ROTATE_STEP * 2)
        .saturate(LIGHT_SATURATE_STEP * 2)
        .hex(),
      [`--${prefix}-400`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP * 2.2)
        .rotate(LIGHT_ROTATE_STEP * 1)
        .saturate(LIGHT_SATURATE_STEP * 1)
        .hex(),
      [`--${prefix}-500`]: Color(colorCode)
        .lightness(55 + LIGHTNESS_STEP)
        .hex(),
      [`--${prefix}-600`]: Color(colorCode)
        .lightness(65 - DARKNESS_STEP * 0.8)
        .hex(),
      [`--${prefix}-700`]: Color(colorCode)
        .lightness(60 - DARKNESS_STEP * 1.2)
        .rotate(DARK_ROTATE_STEP * 1)
        .saturate(DARK_SATURATE_STEP * -1)
        .hex(),
      [`--${prefix}-800`]: Color(colorCode)
        .lightness(55 - DARKNESS_STEP * 2.4)
        .rotate(DARK_ROTATE_STEP * 3)
        .hex(),
      [`--${prefix}-900`]: Color(colorCode)
        .lightness(55 - DARKNESS_STEP * 3.4)
        .rotate(DARK_ROTATE_STEP * 4)
        .saturate(DARK_SATURATE_STEP * 1)
        .hex(),
    }),
    [prefix, colorCode]
  )

export default useColorPalette
