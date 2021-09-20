import type { BigNumber } from "@ethersproject/bignumber"
import { aggregate } from "@makerdao/multicall"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { createContext, PropsWithChildren, useContext, useMemo } from "react"
import useSWR from "swr"
import { ChainData } from "temporaryData/types"
import MulticallAddresses from "./utils/multicall"

type Props = PropsWithChildren<{ chainDatas: ChainData[][] }>

const Balances = createContext<Record<string, number>>({})

const getBalances = async (
  _: string,
  chainDatas: ChainData[][],
  currentChain: string,
  account: string
) => {
  const { balancesToFetch, zeroBalances } = chainDatas.reduce(
    (_acc, chainData) => {
      const acc = _acc
      const currentChainData = chainData.find((data) => data.name === currentChain)
      if (currentChainData) {
        acc.balancesToFetch.push(currentChainData.token.address)
        return acc
      }
      acc.zeroBalances[chainData[0].token.address] = 0
      return acc
    },
    { balancesToFetch: [], zeroBalances: {} }
  )

  const requests = balancesToFetch.map((address) => ({
    target: address,
    call: ["balanceOf(address)(uint256)", account],
    returns: [[address, (value: BigNumber) => +value]],
  }))

  const config = {
    multicallAddress: MulticallAddresses[currentChain],
    rpcUrl: RPC[currentChain].rpcUrls[0],
  }

  const {
    results: { transformed },
  } = await aggregate(requests, config)

  return { ...transformed, ...zeroBalances }
}

const BalancesProvider = ({ chainDatas, children }: Props) => {
  const { account, chainId } = useWeb3React()
  const shouldFetch = typeof account === "string"

  const initialData = useMemo(() => {
    const initialBalances = chainDatas.map((chainData) => {
      const currentChainData = chainData.find(
        (data) => data.name === Chains[chainId]
      )
      return [
        currentChainData
          ? currentChainData.token.address
          : chainData[0].token.address,
        0,
      ]
    })
    return Object.fromEntries(initialBalances)
  }, [chainDatas, chainId, account])

  const { data: balances } = useSWR<Record<string, number>>(
    shouldFetch ? ["balances", chainDatas, Chains[chainId], account] : null,
    getBalances,
    { initialData, revalidateOnMount: true }
  )

  return <Balances.Provider value={balances}>{children}</Balances.Provider>
}

const useBalances = (address: string) => {
  const balances = useContext(Balances)
  if (address === undefined) return undefined
  return balances[address]
}

export { BalancesProvider, useBalances }
