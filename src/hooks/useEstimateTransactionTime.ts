import { useWeb3React } from "@web3-react/core"
import { parseUnits } from "@ethersproject/units"
import useSWR from "swr"
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive"

/**
 * Calls the etherscan API with SWR to keep the data up-to-date.
 * @returns Estimated time for given transaction
 */
const useEstimateTransactionTime = (transaction): number => {
  const { library } = useWeb3React()

  const getEstimatedTransactionTime = async (url: string): Promise<number> => {
    const gasPrice = await library.estimateGas(transaction)
    const weiGasPrice = parseUnits(gasPrice.toString(), "gwei")

    const URL = `${url}&gasprice=${weiGasPrice}`

    const estimatedTransactionTime = await fetch(URL)
      .then((response) => response.json())
      .then((body) => +body.result)
    return estimatedTransactionTime
  }

  const { data: estimatedTransactionTime, mutate } = useSWR(
    `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasestimate&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
    getEstimatedTransactionTime
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return estimatedTransactionTime * 1000
}

export default useEstimateTransactionTime
