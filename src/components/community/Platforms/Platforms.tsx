import ActionCard from "components/common/ActionCard"
import { useContext } from "react"
import { CommunityContext } from "../Context"
import PlatformButton from "./components/PlatformButton"

const Platforms = (): JSX.Element => {
  const { platforms } = useContext(CommunityContext)

  return (
    <ActionCard
      title="Platforms"
      description="All platforms are bridged together so you’ll see the same messages everywhere."
    >
      {Object.keys(platforms)
        .filter((platform) => platforms[platform].active)
        .map((platform) => (
          <PlatformButton key={platform} platform={platform} />
        ))}
    </ActionCard>
  )
}

export default Platforms
