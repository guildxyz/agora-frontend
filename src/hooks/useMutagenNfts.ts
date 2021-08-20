import { aggregate } from "@makerdao/multicall"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { RequirementType, Token } from "temporaryData/types"
import useBalance from "./useBalance"

const config = {
  multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  rpcUrl: "https://rpc.goerli.mudit.blog/",
}

const getMutagenNfts = async (
  _: string,
  amount: number,
  mutagenAddress: string,
  account: string
) => {
  const idRequests = [...Array(amount)].map((_, i) => ({
    target: mutagenAddress,
    call: ["tokenOfOwnerByIndex(address,uint256)(uint256)", account, i],
    returns: [[i, (val) => parseInt(val)]],
  }))
  const {
    results: { transformed: idResults },
  } = await aggregate(idRequests, config)
  const ids: number[] = Object.values(idResults)

  const dataRequests = ids.map((id) => ({
    target: mutagenAddress,
    call: ["unpackPrintId(uint256)(uint8,uint256,uint16)", id],
    returns: [[id], [], []],
  }))
  const {
    results: { transformed: dataResults },
  } = await aggregate(dataRequests, config)

  return Object.entries(dataResults)
    .slice(0, -1)
    .map(([tokenId, genesisIdx]) => {
      // eslint-disable-next-line no-bitwise
      const type = parseInt(tokenId) & 3

      if (type === 0) return `Genesis_${genesisIdx}`
      if (type === 1) return `Print_${genesisIdx}`
      return null
    })
}

const useMutagenNfts = (requirementType: RequirementType, token: Token) => {
  const { account } = useWeb3React()
  const amount: any = useBalance(token)

  const shouldFetch = requirementType === "NFT_HOLD" && !!token && amount > 0

  const { data } = useSWR(
    shouldFetch ? ["mutagen", parseInt(amount), token.address, account] : null,
    getMutagenNfts
  )

  // can't use it because deduping doesn't work with mutate and this way it triggers too many fetches
  // useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useMutagenNfts
