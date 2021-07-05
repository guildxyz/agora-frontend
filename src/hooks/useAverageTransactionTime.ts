import useSWR from "swr"
import msToReadableFormat from "utils/msToReadableFormat"
import useGasPrice from "./useGasPrice"
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive"

const KEY = "4TXV79KN4T8ZHKYDVKFWJ95CUVA81MR9VK"

const getAverageTransactionTime = async (url: string): Promise<number> => {
  const averageTransactionTime = await fetch(url)
    .then((response) => response.json())
    .then((body) => +body.result)
  return averageTransactionTime
}

/**
 * Calls the etherscan API with SWR to keep the data up-to-date.
 * @returns Average transaction time in milliseconds
 */
const useAverageTransactionTime = (): number => {
  const gasPrice = useGasPrice("propose")

  const { data: averageTransactionTime, mutate } = useSWR(
    [
      `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${gasPrice}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
      gasPrice,
    ],
    getAverageTransactionTime
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return averageTransactionTime * 1000
}

export default useAverageTransactionTime
