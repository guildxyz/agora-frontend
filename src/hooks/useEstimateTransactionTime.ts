import { BigNumber } from "@ethersproject/bignumber"
import { TransactionRequest } from "@ethersproject/providers"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import useSWR from "swr"

const getEstimatedTransactionTime = async (
  _: string,
  gasPrice: BigNumber
): Promise<number> => {
  const url = `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasestimate&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}&gasprice=${gasPrice}`

  const estimatedTransactionTime = await fetch(url)
    .then((response) => response.json())
    .then((body) => +body.result)

  return estimatedTransactionTime * 1000
}

/**
 * Calls the etherscan API with SWR to keep the data up-to-date.
 * @returns Estimated time for given transaction
 */
const useEstimateTransactionTime = (transaction: TransactionRequest): number => {
  const { library } = useWeb3React()
  const [gasPrice, setGasPrice] = useState<BigNumber>()

  useEffect(() => {
    ;(async () => {
      const newGasPrice = await library.estimateGas(transaction)
      const weiGasPrice = parseUnits(newGasPrice.toString(), "gwei")
      setGasPrice(weiGasPrice)
    })()
  }, [library, transaction])

  const { data } = useSWR(
    gasPrice ? ["estimatedTransactionTime", gasPrice] : null,
    getEstimatedTransactionTime
  )

  return data
}

export default useEstimateTransactionTime
