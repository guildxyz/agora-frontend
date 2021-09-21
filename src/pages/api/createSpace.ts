import { defaultAbiCoder } from "@ethersproject/abi"
import { Contract } from "@ethersproject/contracts"
import { keccak256 } from "@ethersproject/keccak256"
import { JsonRpcProvider } from "@ethersproject/providers"
import { Wallet } from "@ethersproject/wallet"
import throwsCustomError from "components/admin/hooks/useSpaceFactory/utils/throwsCustomError"
import { RPC, SpaceFactory } from "connectors"
import SPACE_FACTORY_ABI from "constants/spacefactoryABI.json"
import type { NextApiRequest, NextApiResponse } from "next"

// createSpace has to be called by the owner of the space, that's why its being called from here
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tokenAddress, networkName, account } = req.body
  const provider = new JsonRpcProvider(RPC[networkName].rpcUrls[0])
  const wallet = new Wallet(process.env.SPACE_FACTORY_OWNER_PRIVATE_KEY)
  const contract = new Contract(
    SpaceFactory[networkName],
    SPACE_FACTORY_ABI,
    wallet.connect(provider)
  )

  const payload = defaultAbiCoder.encode(
    ["address", "address", "address"],
    [account, tokenAddress, SpaceFactory[networkName]]
  )
  const payloadHash = keccak256(payload)

  const signature = await wallet.signMessage(payloadHash)

  console.log({ signature, tokenAddress, networkName, account })

  const createSpace = throwsCustomError<[string, string]>(contract, "createSpace")

  try {
    const tx = await createSpace(signature, tokenAddress)
    await tx.wait()
    const createdContract = await contract.spaces(tokenAddress)
    res.status(200).json({ createdContract })
  } catch (error) {
    res.status(400).send(error)
  }
}

export default handler
