import { ErrorState } from "components/common/Error"
import type { SignErrorType } from "../hooks/usePersonalSign"

const processConnectionError = (error: SignErrorType): ErrorState => {
  const { code, message } = error

  switch (code) {
    case 1:
      return {
        title: "Not implemented",
        description: "This feature is not yet implemented.",
      }
    default:
      console.error(message)
      return {
        title: "An unknown error occurred",
        description: "Check the console for more details.",
      }
  }
}

export default processConnectionError
