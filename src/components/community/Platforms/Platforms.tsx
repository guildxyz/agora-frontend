import ActionCard from "components/common/ActionCard"
import PlatformButton from "./components/PlatformButton"
import type { PlatformsProps as Props } from "./types"

const Platforms = ({ data, communityId }: Props): JSX.Element => (
  <ActionCard
    title="Platforms"
    description="All platforms are bridged together so you’ll see the same messages everywhere."
  >
    {Object.keys(data)
      .filter((platform) => data[platform].active)
      .map((platform) => (
        <PlatformButton key={platform} {...{ platform, communityId }} />
      ))}
  </ActionCard>
)

export default Platforms
