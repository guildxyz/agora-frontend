import { useRouter } from "next/router"
import { Level } from "temporaryData/types"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useSubmitMachine, { FormData as CommunityFormData } from "./useSubmitMachine"

const imagesToFormData = (_data: CommunityFormData, levels: Level[]) => {
  const formData = new FormData()

  // Renaming the community photo
  if (_data.image) {
    const [, extension] = _data.image.name.split(".")
    formData.append("image", _data.image, `community.${extension}`)
  }

  // Renaming the level images
  if (_data.levels?.length > 0 && levels.length > 0) {
    for (let i = 0; i < levels.length; i += 1) {
      if (_data.levels[i].image) {
        const [, extension] = _data.levels[i].image.name.split(".")
        formData.append(
          "image",
          _data.levels[i].image,
          `${levels[i].id}.${extension}`
        )
      }
    }
  }

  return formData
}

const useUploadImages = (method: "POST" | "PATCH", redirectPath = "info") => {
  const router = useRouter()

  const fetchService = async (
    _context: ContextType,
    { data }: SignEvent<CommunityFormData>
  ) => {
    const { id, levels } = await fetch(
      `${process.env.NEXT_PUBLIC_API}/community/urlName/${data.urlName}`
    ).then((response) => response.json())

    const formData = imagesToFormData(data, levels)
    return fetch(`${process.env.NEXT_PUBLIC_API}/community/${id}/image`, {
      method: "POST",
      body: formData,
    })
  }

  const redirectAction = async ({ urlName }: ContextType) => {
    router.push(`/${urlName}/${redirectPath}`)
  }

  return useSubmitMachine<CommunityFormData>(
    "Images updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    redirectAction
  )
}

export default useUploadImages
