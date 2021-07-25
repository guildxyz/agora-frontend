type Props = {
  width?: string | number
  height?: string | number
}

const Logo = ({ width = 125, height = 122 }: Props): JSX.Element => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 125 122"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="22.9497" height="121.761" />
    <path d="M55.4443 50.9678L70.6557 68.1386L23.0169 121.647L3.63184 109.149L55.4443 50.9678Z" />
    <path d="M5.32799 13.8702L23.0867 0.0313432L118.984 121.687L90.5697 121.687L5.32799 13.8702Z" />
    <rect
      x="101.313"
      y="121.825"
      width="95.0978"
      height="22.9975"
      transform="rotate(-90 101.313 121.825)"
    />
  </svg>
)

export default Logo