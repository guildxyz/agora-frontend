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
  isOpen: boolean
  onClose: () => void
}
type PlatformButtonProps = {
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
