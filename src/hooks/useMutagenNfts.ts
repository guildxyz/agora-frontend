import { aggregate } from "@makerdao/multicall"
import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { RequirementType, Token } from "temporaryData/types"
import useBalance from "./useBalance"
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive"

const config = { preset: "goerli" }

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
  console.log(idRequests)

  const {
    results: { transformedIds },
  } = await aggregate(idRequests, config)
  console.log(transformedIds)
  const ids = Object.values(transformedIds)

  const dataRequests = ids.map((id) => ({
    target: mutagenAddress,
    call: ["unpackPrintId(uint256)(uint8,uint256,uint16)", id],
    returns: [[id], [], []],
  }))
  const {
    results: { transformedData },
  } = await aggregate(dataRequests, config)
  const correctIdsArray = Object.entries(transformedData).slice(0, -1)
  const data = correctIdsArray.reduce((arr, [tokenId, genesisIdx]) => {
    // eslint-disable-next-line no-bitwise
    const type = tokenId as any & 3
    if (type === 0) {
      arr.push(`Genesis_${genesisIdx}`)
    } else if (type === 1) {
      arr.push(`Print_${genesisIdx}`)
    }
    return arr
  }, [])
  return data
}

const useMutagenNfts = (requirementType: RequirementType, token: Token) => {
  const { account } = useWeb3React()
  const amount = useBalance(token)

  const shouldFetch = requirementType === "NFT_HOLD" && !!token && amount > 0

  /**
   * TODO: deduping doesn't work for some reason. getMutagenNfts get's called 4 times
   * in a row even though the parameters haven't changed
   */
  const { data, mutate } = useSWR(
    shouldFetch ? ["mutagen", amount, token.address, account] : null,
    getMutagenNfts
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useMutagenNfts
