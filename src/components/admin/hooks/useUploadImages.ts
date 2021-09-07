import { FormData as CommunityFormData } from "pages/[community]/admin/community"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useSubmitMachine from "./useSubmitMachine"

const useUploadImages = (callback: () => void) => {
  const fetchService = (
    _context: ContextType,
    { data }: SignEvent<CommunityFormData>
  ) => {
    console.log("INPUT:", data)
    // TODO...
    // We should somehow get the preprocessed data here and send it to the image upload endpoint

    return null
  }

  const redirectAction = async () => {
    if (typeof callback === "function") callback()
  }

  const preprocess = (_data: CommunityFormData) => {
    // Creating a FormData object & populating it with the necessary data
    const formDataToSubmit = new FormData()

    // Renaming the community photo
    if (_data.image) {
      const [, extension] = _data.image.name.split(".")
      formDataToSubmit.append("image", _data.image, `community.${extension}`)
    }

    // Renaming the level images
    _data.levels?.forEach((level) => {
      if (level.image) {
        const [, extension] = level.image.name.split(".")
        formDataToSubmit.append("image", level.image, `${level.id}.${extension}`)
      }
    })

    return formDataToSubmit // We'll need to submit this to the image upload endpoint!
  }

  return useSubmitMachine<CommunityFormData>(
    "Images updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    redirectAction,
    preprocess
  )
}

export default useUploadImages
