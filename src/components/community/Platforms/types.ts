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
  title: string
  description: string
  buttonText?: string
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
