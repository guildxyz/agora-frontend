import type { Platforms as PlatformsType } from "temporaryData/types"

type Error = { code: number; message: string } | null
type State = "initial" | "loading" | "success" | Error
type SignErrorProps = { error: Error }
type JoinOrLeavePlatformProps = {
  platform: string
  communityId: number
  isOpen: boolean
  onClose: () => void
}
type PlatformButtonProps = {
  communityId: number
  platform: string
}
type PlatformsProps = {
  data: PlatformsType
  communityId: number
}

export type {
  Error,
  State,
  SignErrorProps,
  JoinOrLeavePlatformProps,
  PlatformButtonProps,
  PlatformsProps,
}
