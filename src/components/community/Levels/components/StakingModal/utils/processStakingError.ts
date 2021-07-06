import { ErrorInfo } from "components/common/Error"
import { SignErrorType } from "components/community/Platforms/components/JoinModal/hooks/usePersonalSign"

const processStakingError = (error: SignErrorType): ErrorInfo => {
  switch (error.code) {
    case 4001:
      return {
        title: "Cancelled",
        description: "The signature process got cancelled.",
      }
    case -32603:
      return {
        title: "Transaction underpriced",
        description:
          "The gas price has been set to 0, a transaction like that can't succeed.",
      }
    default:
      break
  }

  console.error(error)
  return {
    title: "An unknown error occurred",
    description: "Check the console for more details",
  }
}

export default processStakingError
