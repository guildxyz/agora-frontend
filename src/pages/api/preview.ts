import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { urlName } = req.query

  if (!urlName) {
    return res.status(401).json({ message: "Invalid request" })
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/community/urlName/${urlName}`
  )

  if (!response.ok) {
    return res.status(401).json({ message: "Invalid urlName" })
  }

  const community = await response.json()

  res.setPreviewData(
    {},
    {
      maxAge: 600, // Preview cookie expires in 10 minutes
    }
  )

  if (req.query.levelsPage) {
    res.redirect(`/${community.urlName}/community`)
  } else {
    res.redirect(`/${community.urlName}`)
  }
}

export default handler
