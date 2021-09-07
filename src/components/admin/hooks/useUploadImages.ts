import { useRouter } from "next/router"
import { ContextType, SignEvent } from "../utils/submitMachine"
import useSubmitMachine, { FormData as CommunityFormData } from "./useSubmitMachine"

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

const useUploadImages = (method = "PUST") => {
  const router = useRouter()

  const fetchService = async (
    _context: ContextType,
    { data }: SignEvent<CommunityFormData>
  ) => {
    const formData = imagesToFormData(data)
    const { id } = await fetch(
      `${process.env.NEXT_PUBLIC_API}/community/urlName/${data.urlName}`
    ).then((response) => response.json())
    return fetch(`${process.env.NEXT_PUBLIC_API}/community/${id}/image`, {
      method: "POST",
      body: formData,
    })
  }

  const redirectAction =
    method === "PATCH"
      ? ({ urlName }: ContextType) =>
          fetch(`/api/preview?urlName=${urlName}`)
            .then((res) => res.json())
            .then((cookies: string[]) => {
              cookies.forEach((cookie: string) => {
                document.cookie = cookie
              })
              router.push(`/${urlName}`)
            })
      : ({ urlName }: ContextType) =>
          new Promise<void>(() => router.push(`/${urlName}`))

  return useSubmitMachine<CommunityFormData>(
    "Images updated! It might take up to 10 sec for the page to update. If it's showing old data, try to refresh it in a few seconds.",
    fetchService,
    redirectAction
  )
}

export default useUploadImages
