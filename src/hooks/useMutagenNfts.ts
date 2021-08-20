import { Contract } from "@ethersproject/contracts"
import { ExternalProvider, Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import mutagenABI from "constants/mutagenABI.json"
import useSWR from "swr"
import { RequirementType, Token } from "temporaryData/types"
import useBalance from "./useBalance"

const getMutagenNfts = async (
  _: string,
  amount: number,
  contractAddress: string,
  account: string
) =>
  Promise.all(
    [...Array(amount)].map((_, i) =>
      (async () => {
        const tokenId = await new Contract(
          contractAddress,
          mutagenABI,
          new Web3Provider(
            (
              window as Window & typeof globalThis & { ethereum: ExternalProvider }
            ).ethereum
          )
        ).tokenOfOwnerByIndex(account, i)
        // eslint-disable-next-line no-bitwise
        const tokenType = tokenId & 3
        // const url = await contract.tokenURI(tokenId)
        // const data = await fetch(url, { mode: "no-cors" })
        return tokenType
      })()
    )
  )

const useMutagenNfts = (requirementType: RequirementType, token: Token) => {
  const { account } = useWeb3React()
  const amount = useBalance(token)

  const shouldFetch = requirementType === "NFT_HOLD" && amount > 0

  const { data } = useSWR(
    shouldFetch ? ["mutagen", amount, token?.address, account] : null,
    getMutagenNfts,
    {
      dedupingInterval: 3000,
      refreshInterval: 10_000,
    }
  )

  return data
}

export default useMutagenNfts
