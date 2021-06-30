import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"

const useHasStaked = () => {
  const {
    chainData: { stakeToken },
  } = useCommunity()
  const { data: staked } = useBalance(stakeToken)

  return staked > 0
}

export default useHasStaked
