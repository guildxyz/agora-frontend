import AdminLayout from "components/admin/AdminLayout/AdminLayout"
import { settingsSideNavItems } from "./index"

const GeneralSettings = (): JSX.Element => (
  <AdminLayout title="Settings - General" sideNavItems={settingsSideNavItems}>
    <div>General settings</div>
  </AdminLayout>
)

export default GeneralSettings
