import { ErrorInfo } from "components/common/Error"
import type { WalletError } from "utils/processWalletError"
import processWalletError from "utils/processWalletError"

const processUnstakingError = (error: WalletError): ErrorInfo => {
  switch (error.message) {
    case "execution reverted: Not enough unlocked tokens":
      return {
        title: "Not enough unlocked tokens",
        description:
          "If your timelock has just expired, you have to wait until the next block to be able unstake. Try again!",
      }
    default:
      return processWalletError(error)
  }
}

export default processUnstakingError
