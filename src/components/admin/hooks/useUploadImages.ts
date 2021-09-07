import { FormData as CommunityFormData } from "pages/[community]/admin/community"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useSubmitMachine from "./useSubmitMachine"

const imagesToFormData = (_data: CommunityFormData) => {
  // Creating a FormData object & populating it with the necessary data
  const formData = new FormData()

  // Renaming the community photo
  if (_data.image) {
    const [, extension] = _data.image.name.split(".")
    formData.append("image", _data.image, `community.${extension}`)
  }

  // Renaming the level images
  _data.levels?.forEach((level) => {
    if (level.image) {
      const [, extension] = level.image.name.split(".")
      formData.append("image", level.image, `${level.id}.${extension}`)
    }
  })

  return formData // We'll need to submit this to the image upload endpoint!
}

const useUploadImages = () => {
  const fetchService = async (
    _context: ContextType,
    { data }: SignEvent<CommunityFormData>
  ) => {
    const formData = imagesToFormData(data)
    const { id } = await fetch(
      `${process.env.NEXT_PUBLIC_API}/community/urlName/${data.urlName}`
    ).then((response) => response.json())
    return fetch(`${process.env.NEXT_PUBLIC_API}/community/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
  }

  return useSubmitMachine<CommunityFormData>(
    "Images updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    async () => {}
  )
}

export default useUploadImages
