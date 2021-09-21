import type { Contract } from "@ethersproject/contracts"

const throwsCustomError =
  <Params extends any[]>(contract: Contract, methodName: string) =>
  async (...params: [...Params]) => {
    try {
      const tx = await contract[methodName](...params)
      await tx.wait()
      return tx
    } catch (error) {
      await contract.callStatic[methodName](...params, {
        from: error.transaction.from,
        gasPrice: 100,
        gasLimit: 1000000,
      })
    }
  }

export default throwsCustomError
