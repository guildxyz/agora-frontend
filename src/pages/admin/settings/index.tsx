import { SideNavItem } from "components/admin/AdminLayout/components/SideNav"
import { GetServerSideProps } from "next"
import { Gear, PaintBrushBroad, Stack } from "phosphor-react"

export const settingsSideNavItems: SideNavItem[] = [
  {
    name: "General",
    path: "/admin/settings/general",
    icon: Gear,
  },
  {
    name: "Levels",
    path: "/admin/settings/levels",
    icon: Stack,
  },
  {
    name: "Appearance",
    path: "/admin/settings/appearance",
    icon: PaintBrushBroad,
  },
]

const Settings = (): JSX.Element => <></>

const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/admin/settings/general",
  },
  props: {},
})

export default Settings
export { getServerSideProps }
