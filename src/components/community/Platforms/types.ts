type Error = { code: number; message: string } | null
type State = "initial" | "loading" | "success" | Error
type SignErrorProps = { error: Error }
type JoinOrLeavePlatformProps = {
  platform: string
  isOpen: boolean
  onClose: () => void
}
type PlatformButtonProps = {
  platform: string
  communityId: number
}

export type {
  Error,
  State,
  SignErrorProps,
  JoinOrLeavePlatformProps,
  PlatformButtonProps,
}
