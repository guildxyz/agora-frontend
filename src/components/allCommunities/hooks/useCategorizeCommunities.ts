import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import { hasAccessToLevel } from "components/community/Levels/components/Level/hooks/useLevelAccess"
import ERC20_ABI from "constants/erc20abi.json"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import { Community, Token } from "temporaryData/types"
import parseBalance from "utils/parseBalance"

type Categories = {
  joined: Array<Community>
  hasAccess: Array<Community>
  other: Array<Community>
}

// TODO: replace with a backend-connected implementation once it's available
const joinedCommunities = async (address: string) => [1]

const getBalances = async (
  stakeTokenAddress: string,
  tokenAddress: string,
  provider: any,
  address: string
): Promise<[number, number]> => {
  const stakeTokenContract = new Contract(stakeTokenAddress, ERC20_ABI, provider)
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider)

  const [stakeBalance, tokenBalance] = await Promise.all([
    stakeTokenContract
      .balanceOf(address)
      .then((balance: BigNumber) => +parseBalance(balance)),
    tokenContract
      .balanceOf(address)
      .then((balance: BigNumber) => +parseBalance(balance)),
  ])

  return [stakeBalance, tokenBalance]
}

const categorizeCommunities = async (
  _: "categorized_communities",
  communities: Community[],
  address: string,
  currentChain: string,
  provider: any
) => {
  const updateCategories = async (
    _categories: Promise<Categories> | Categories,
    community: Community
  ): Promise<Categories> => {
    const categories = await _categories

    // Is the user joined
    const joined = await joinedCommunities(address)
    if (joined.includes(community.id)) {
      categories.joined.push(community)
      return categories
    }

    // So the indexing would not couse error in case this happens
    if (!community.levels.length) {
      categories.other.push(community)
      return categories
    }

    // hasAccessToLevel would check this but since it's a common case and we can avoid fetching the balances, I decided to leave it here
    if (community.levels[0].accessRequirement.type === "open") {
      categories.hasAccess.push(community)
      return categories
    }

    const [stakeBalance, tokenBalance] = await getBalances(
      community.chainData[currentChain].stakeToken.address,
      community.chainData[currentChain].token.address,
      provider,
      address
    )

    const [hasAccess] = hasAccessToLevel(
      community.levels[0].accessRequirement,
      stakeBalance,
      tokenBalance
    )

    if (hasAccess) {
      categories.hasAccess.push(community)
      return categories
    }

    // If none of the above cases happened
    categories.other.push(community)
    return categories
  }

  const categories = await communities.reduce(updateCategories, {
    joined: [],
    hasAccess: [],
    other: [],
  })

  // console.log(categories)

  return categories
}

const useCategorizeCommunities = (communities: Community[]) => {
  const { account, chainId, library } = useWeb3React()
  const {
    data: categories,
    mutate,
    error,
  } = useSWR(
    ["categorized_communities", communities, account, Chains[chainId], library],
    categorizeCommunities,
    {
      initialData: {
        joined: [],
        hasAccess: [],
        other: [],
      },
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return { categories, areCategoriesLoading: !categories && !error }
}

export default useCategorizeCommunities
