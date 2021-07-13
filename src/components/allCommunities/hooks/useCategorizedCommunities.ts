import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { Chains } from "connectors"
import ERC20_ABI from "constants/erc20abi.json"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import { Community } from "temporaryData/types"
import parseBalance from "utils/parseBalance"

type Categories = {
  joined: Array<Community>
  hasAccess: Array<Community>
  other: Array<Community>
}

const joinedCommunities = async (address: string) => [1]

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

    // Always has access if there is an open level
    if (community.levels[0].accessRequirement.type === "open") {
      categories.hasAccess.push(community)
      return categories
    }

    // Has access if enough tokens are staked
    const stakeTokenContract = new Contract(
      community.chainData[currentChain].stakeToken.address,
      ERC20_ABI,
      provider
    )

    const stakeBalance = await stakeTokenContract
      .balanceOf(address)
      .then((balance: BigNumber) => +parseBalance(balance))

    if (stakeBalance >= community.levels[0].accessRequirement.amount) {
      categories.hasAccess.push(community)
      return categories
    }

    // Has access if enough tokens are held
    const holdTokenContract = new Contract(
      community.chainData[currentChain].token.address,
      ERC20_ABI,
      provider
    )

    const holdBalance = await holdTokenContract
      .balanceOf(address)
      .then((balance: BigNumber) => +parseBalance(balance))

    if (
      community.levels[0].accessRequirement.type === "hold" &&
      holdBalance >= community.levels[0].accessRequirement.amount
    ) {
      categories.hasAccess.push(community)
      return categories
    }

    // If none of the above cases happened
    categories.other.push(community)
    return categories
  }

  return await communities.reduce(updateCategories, {
    joined: [],
    hasAccess: [],
    other: [],
  })
}

const useCategorizedCommunities = (communities: Community[]) => {
  const { account, chainId, library } = useWeb3React()
  const { data: categorized, mutate } = useSWR(
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

  return categorized
}

export default useCategorizedCommunities
