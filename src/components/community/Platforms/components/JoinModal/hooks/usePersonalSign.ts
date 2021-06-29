import type { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"

type SignErrorType = { code: number; message: string }

const usePersonalSign = (): ((message: string) => Promise<any>) => {
  const { library, account } = useWeb3React<Web3Provider>()

  return async (message: string): Promise<any> => {
    try {
      return await library.getSigner(account).signMessage(message)
    } catch (signError) {
      const error = Error(signError.message)
      error.name = signError.code.toString()
      throw error
    }
  }
}

export type { SignErrorType }
export { usePersonalSign }
