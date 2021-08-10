import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `${req.body.url}&apikey=${process.env.ETHERSCAN_API_KEY}`
  try {
    const response = await fetch(url)
    res.status(response.status).json(response.body)
  } catch (_) {
    res.status(404).send("Unable to contact etherscan")
  }
}

export default handler
