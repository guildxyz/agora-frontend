import type { Platforms as PlatformsType } from "temporaryData/types"

type Error = { code: number; message: string } | null
type State = "initial" | "loading" | "success" | Error
type ModalProps = {
  isOpen: boolean
  onClose: () => void
  communityId: number
  platform: string
  isMember: boolean
}
type SignErrorProps = { error: Error }
type JoinOrLeavePlatformProps = {
  platform: string
  communityId: number
  isOpen: boolean
  onClose: () => void
}
type PlatformButtonProps = {
  communityId: number
  isMember: boolean
  platform: string
}

export type {
  Error,
  State,
  ModalProps,
  SignErrorProps,
  JoinOrLeavePlatformProps,
  PlatformButtonProps,
}
