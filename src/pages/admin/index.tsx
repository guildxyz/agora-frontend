import { SideNavItem } from "components/admin/AdminLayout/components/SideNav"
import { GetServerSideProps } from "next"
import { Gear, PaintBrushBroad, Stack } from "phosphor-react"

export const settingsSideNavItems: SideNavItem[] = [
  {
    name: "General",
    path: "/admin/general",
    icon: Gear,
  },
  {
    name: "Levels",
    path: "/admin/levels",
    icon: Stack,
  },
  {
    name: "Appearance",
    path: "/admin/appearance",
    icon: PaintBrushBroad,
  },
]

const Settings = (): JSX.Element => <></>

const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/admin/general",
  },
  props: {},
})

export default Settings
export { getServerSideProps }
