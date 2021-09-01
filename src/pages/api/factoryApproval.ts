import { Contract } from "@ethersproject/contracts"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Wallet } from "@ethersproject/wallet"
import { RPC, SpaceFactory } from "connectors"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import type { NextApiRequest, NextApiResponse } from "next"

// setApproval has to be called by the owner of the space, that's why its being called from here
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { networkName, tokenOwner, tokenAddress } = req.body
  const provider = new JsonRpcProvider(RPC[networkName].rpcUrls[0])
  const wallet = new Wallet(process.env.SPACE_FACTORY_OWNER_PRIVATE_KEY)
  const contract = new Contract(
    SpaceFactory[networkName],
    SPACE_FACTORY_ABI,
    wallet.connect(provider)
  )
  try {
    const tx = await contract.setApproval(tokenOwner, tokenAddress, true, {
      gasPrice: await provider.getGasPrice(),
      gasLimit: 1000000,
    })
    await tx.wait()
    res.status(200).send("setApproval successful")
  } catch (error) {
    res.status(400).send(error)
  }
}

export default handler
