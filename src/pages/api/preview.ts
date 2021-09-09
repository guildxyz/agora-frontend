import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { returnUrl } = req.query

  // console.log("/api/preview called", returnUrl)

  if (!returnUrl || typeof returnUrl !== "string") {
    return res.status(401).json({ message: "Invalid request" })
  }

  res.setPreviewData({})

  res.redirect(returnUrl)
}

export default handler
