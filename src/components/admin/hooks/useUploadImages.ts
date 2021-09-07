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
      formDataToSubmit.append("image", _data.image, "community")
    }

    // Renaming the level images
    _data.levels?.forEach((level) => {
      if (level.image) {
        formDataToSubmit.append("image", level.image, level.id.toString())
      }
    })

    console.log("PREPROCESS:", formDataToSubmit)
    return formDataToSubmit
  }

  return useSubmitMachine<CommunityFormData>(
    "Images updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    redirectAction,
    preprocess
  )
}

export default useUploadImages
