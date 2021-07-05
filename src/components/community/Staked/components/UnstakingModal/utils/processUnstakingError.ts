import { ErrorInfo } from "components/common/Error"
import { SignErrorType } from "components/community/Platforms/components/JoinModal/hooks/usePersonalSign"

const processUnstakingError = (error: SignErrorType): ErrorInfo => {
  const { code, message } = error

  switch (code) {
    case 4001:
      return {
        title: "Signature denied",
        description: "User denied transaction signature.",
      }
    default:
      console.error(message)
      return {
        title: "An unknown error occurred",
        description: "Check the console for more details.",
      }
  }
}

export default processUnstakingError
