import { GetServerSideProps } from "next"

const Admin = () => <></>

const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/admin/settings/general",
  },
  props: {},
})

export default Admin
export { getServerSideProps }
