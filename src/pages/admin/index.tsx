import { GetServerSideProps } from "next"

const Admin = (): JSX.Element => <></>

const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/admin/settings",
  },
  props: {},
})

export default Admin
export { getServerSideProps }
