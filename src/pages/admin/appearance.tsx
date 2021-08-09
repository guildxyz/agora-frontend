import { VStack } from "@chakra-ui/react"
import AdminLayout from "components/admin/AdminLayout/AdminLayout"
import Appearance from "components/admin/settings/appearance/Appearance"
import { settingsSideNavItems } from "./index"

const AppearanceSettings = (): JSX.Element => (
  <AdminLayout title="Settings - Appearance" sideNavItems={settingsSideNavItems}>
    <VStack spacing={12}>
      <Appearance />
    </VStack>
  </AdminLayout>
)

export default AppearanceSettings
