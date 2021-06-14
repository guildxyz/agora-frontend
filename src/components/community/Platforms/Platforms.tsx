import ActionCard from "components/common/ActionCard"
import { useContext } from "react"
import { CommunityContext } from "../Context"
import PlatformButton from "./components/PlatformButton"

// ! This is a dummy function for the demo !
const isMember = (platform: string) => {
  if (platform === "telegram") {
    return true
  }
  return false
}

const Platforms = (): JSX.Element => {
  const { platforms, id: community } = useContext(CommunityContext)

  return (
    <ActionCard
      title="Platforms"
      description="All platforms are bridged together so you’ll see the same messages everywhere."
    >
      {Object.keys(platforms).map((platform) => (
        <PlatformButton
          key={platform}
          communityId={community}
          isMember={isMember(platform)}
          platform={platform}
        />
      ))}
    </ActionCard>
  )
}

export default Platforms
