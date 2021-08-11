const lightness = 95
const darkness = 10
const darkSteps = 4
const lightSteps = 5

export const LIGHTNESS_STEP = (lightness - 50) / lightSteps
export const DARKNESS_STEP = (50 - darkness) / darkSteps

export const LIGHT_ROTATE_STEP = 1 / lightSteps
export const DARK_ROTATE_STEP = 1 / darkSteps

export const LIGHT_SATURATE_STEP = 1 / lightSteps
export const DARK_SATURATE_STEP = 1 / darkSteps
