import { BigNumber } from "@ethersproject/bignumber"
import { parseUnits } from "@ethersproject/units"
import useSWR from "swr"
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive"

const KEY = "4TXV79KN4T8ZHKYDVKFWJ95CUVA81MR9VK"

const getGasPrice = async (
  url: string,
  type: "Propose" | "Safe" | "Fast"
): Promise<BigNumber> => {
  const gasPrice = await fetch(url)
    .then((response) => response.json())
    .then((body) => body.result[type + "GasPrice"])
  console.log(parseUnits(gasPrice, "gwei"))
  return parseUnits(gasPrice, "gwei")
}

/**
 * Calls the etherscan API with SWR to keep the data up-to-date.
 * @param type The needed estimation type, can be "propose", "safe", or "fast"
 * @returns The gas price with the given estimation in gwei
 */
const useGasPrice = (type: "propose" | "pafe" | "fast"): BigNumber => {
  const gasEstimationType = type.charAt(0).toUpperCase() + type.slice(1)
  const { data: gasPrice, mutate } = useSWR(
    [
      `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${KEY}`,
      gasEstimationType,
    ],
    getGasPrice,
    {
      initialData: BigNumber.from(-1),
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return gasPrice
}

export default useGasPrice
