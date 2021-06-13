import { IconProps } from "phosphor-react"

type Error = { code: number; message: string } | null
type State = "initial" | "loading" | "success" | Error
type ModalProps = {
  isOpen: boolean
  onClose: () => void
  communityId: number
  platform: string
  communityType: string
  isMember: boolean
}
type SignErrorProps = { error: Error }
type JoinOrLeavePlatformProps = {
  platform: string
  communityType: string
  communityId: number
}
type PlatformButtonProps = {
  logo: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  communityId: number
  isMember: boolean
  platform: string
  communityType: string
}

export type {
  Error,
  State,
  ModalProps,
  SignErrorProps,
  JoinOrLeavePlatformProps,
  PlatformButtonProps,
}
