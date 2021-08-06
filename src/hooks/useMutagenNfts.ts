import { useWeb3React } from "@web3-react/core"
import mutagenABI from "constants/mutagenABI.json"
import { RequirementType, Token } from "temporaryData/types"
import useBalance from "./useBalance"
import useContract from "./useContract"

const useMutagenNfts = (requirementType: RequirementType, token: Token): [] => {
  const { account } = useWeb3React()
  const amount: any = useBalance(token)
  const contract = useContract(token.address, mutagenABI)

  if (requirementType !== "NFT_HOLD" || !contract || !amount) return []

  Promise.all(
    [...Array(parseInt(amount, 10))].map((_, i) =>
      (async () => {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i)
        // eslint-disable-next-line no-bitwise
        const type = tokenId & 3
        const url = await contract.tokenURI(tokenId)
        const data = await fetch(url, { mode: "no-cors" })
        return { type, data }
      })()
    )
  ).then((val) => console.log(val))
}

export default useMutagenNfts
