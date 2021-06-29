import { ErrorInfo } from "components/common/Error"

const processConnectionError = (error: Error): ErrorInfo => {
  switch (error.name) {
    case "4001":
      return {
        title: "Cancelled",
        description: "The signature process got cancelled.",
      }
    default:
      break
  }
  if (error.message.includes("NetworkError")) {
    return {
      title: "Network error",
      description: "Unable to connect to server.",
    }
  }

  console.error(error)
  return {
    title: "An unknown error occurred",
    description: "Check the console for more details.",
  }
}

export default processConnectionError
