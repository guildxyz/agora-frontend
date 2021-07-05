import { BigNumber } from "@ethersproject/bignumber"
import { parseUnits } from "@ethersproject/units"
import useSWR from "swr"
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive"

const getGasPrice = async (
  url: string,
  type: "Propose" | "Safe" | "Fast"
): Promise<BigNumber> => {
  const gasPrice = await fetch(url)
    .then((response) => response.json())
    .then((body) => body.result[type + "GasPrice"])
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
      `https://api-ropsten.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`,
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
