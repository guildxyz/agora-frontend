import ActionCard from "components/common/ActionCard"
import { DiscordLogo, TelegramLogo } from "phosphor-react"
import type { Platforms as PlatformsType } from "temporaryData/types"
import PlatformButton from "./components/PlatformButton"

type Props = {
  data: PlatformsType
  community: number
}

// ! This is a dummy function for the demo !
const isMember = (platform: string) => {
  if (platform === "telegram") {
    return true
  }
  return false
}

// ? These could be stored in temporaryData/communities.ts ?
const communityTypes = {
  telegram: "group",
  discord: "server",
}
const platformIcons = {
  telegram: TelegramLogo,
  discord: DiscordLogo,
}

const Platforms = ({ data, community }: Props): JSX.Element => (
  <ActionCard
    title="Platforms"
    description="All platforms are bridged together so you’ll see the same messages everywhere."
  >
    {Object.keys(data).map((platform) => (
      <PlatformButton
        key={platform}
        communityId={community}
        isMember={isMember(platform)}
        platform={platform}
        communityType={communityTypes[platform]}
        logo={platformIcons[platform]}
      />
    ))}
  </ActionCard>
)

export default Platforms
