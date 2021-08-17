import { Community } from "temporaryData/types"

type Props = {
  communityData: Community
}

const AdminHomePage = ({ communityData }: Props): JSX.Element => (
  <div>Community admin home page - {communityData.name}</div>
)

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default AdminHomePage
