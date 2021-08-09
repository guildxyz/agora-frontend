import { VStack } from "@chakra-ui/react"
import AdminLayout from "components/admin/AdminLayout/AdminLayout"
import Details from "components/admin/settings/general/Details"
import Platforms from "components/admin/settings/general/Platforms"
import { settingsSideNavItems } from "./index"

const GeneralSettings = (): JSX.Element => (
  <AdminLayout title="Settings - General" sideNavItems={settingsSideNavItems}>
    <VStack spacing={12}>
      <Details />
      <Platforms />
    </VStack>
  </AdminLayout>
)

export default GeneralSettings
