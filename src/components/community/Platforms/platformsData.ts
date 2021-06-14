import { DiscordLogo, TelegramLogo } from "phosphor-react"

const platformsData = {
  telegram: {
    logo: TelegramLogo,
    join: {
      title: "Join Telegram",
      description:
        "To generate your invite link, first you have to sign a message with your wallet.",
    },
    leave: {
      title: "Leave Telegram group",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      buttonText: "Leave group",
    },
  },
  discord: {
    logo: DiscordLogo,
    join: {
      title: "Join Discord server",
      description:
        "To generate your invite link, first you have to sign a message with your wallet.",
    },
    leave: {
      title: "Leave Discord server",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      buttonText: "Leave server",
    },
  },
}

export default platformsData
