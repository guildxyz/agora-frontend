import { VStack } from "@chakra-ui/react"
import AdminLayout from "components/admin/AdminLayout/AdminLayout"
import Levels from "components/admin/settings/levels/Levels"
import UsedToken from "components/admin/settings/levels/UsedToken"
import { settingsSideNavItems } from "./index"

const LevelSettings = (): JSX.Element => (
  <AdminLayout title="Settings - Levels" sideNavItems={settingsSideNavItems}>
    <VStack spacing={12}>
      <UsedToken />
      <Levels />
    </VStack>
  </AdminLayout>
)

export default LevelSettings
