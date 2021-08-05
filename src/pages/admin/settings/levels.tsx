import AdminLayout from "components/admin/AdminLayout/AdminLayout"
import { settingsSideNavItems } from "./index"

const LevelSettings = (): JSX.Element => (
  <AdminLayout title="Settings - Levels" sideNavItems={settingsSideNavItems}>
    <div>Level settings</div>
  </AdminLayout>
)

export default LevelSettings
