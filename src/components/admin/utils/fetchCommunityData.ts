import { communities } from "temporaryData/communities"
import tokens from "temporaryData/tokens"

const fetchCommunityData = async (urlName: string) => {
  // Set this to true if you don't want the data to be fetched from backend
  const DEBUG = false

  const localData = [...communities, ...tokens].find((i) => i.urlName === urlName)

  const communityData =
    DEBUG && process.env.NODE_ENV !== "production"
      ? localData
      : await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/urlName/${urlName}`
        ).then((response: Response) => (response.ok ? response.json() : localData))

  return communityData
}

export default fetchCommunityData
