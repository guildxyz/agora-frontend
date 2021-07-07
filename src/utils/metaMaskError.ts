import { ErrorInfo } from "components/common/Error"

type MetaMaskError = { code: number; message: string }

const processMetaMaskError = (error: MetaMaskError): ErrorInfo => {
  switch (error.code) {
    case 4001:
      return {
        title: "Request Rejected",
        description: "Request got rejected by the user",
      }
    case 4100:
      return {
        title: "Unauthorized",
        description:
          "The requested method and/or account has not been authorized by the user",
      }
    case 4200:
      return {
        title: "Unsupported Method",
        description: "MetaMask does not support the requested method",
      }
    case 4900:
      return {
        title: "Disconnected",
        description: "MetaMask is disconnected from all chains",
      }
    case 4901:
      return {
        title: "Chain Disconnected",
        description: "MetaMask is not connected to the requested chain",
      }
    case -32700:
      return {
        title: "Parse error",
        description: "Invalid JSON",
      }
    case -32600:
      return {
        title: "Invalid request",
        description: "JSON is not a valid request object",
      }
    case -32601:
      return {
        title: "Method not found",
        description: "Method does not exist",
      }
    case -32602:
      return {
        title: "Invalid params",
        description: "Invalid method parameters",
      }
    case -32603:
      return {
        title: "Internal error",
        description: "Internal JSON-RPC error",
      }
    case -32000:
      return {
        title: "Invalid input",
        description: "Missing or invalid parameters",
      }
    case -32001:
      return {
        title: "Resource not found",
        description: "Requested resource not found",
      }
    case -32002:
      return {
        title: "Resource unavailable",
        description: "Requested resource not available",
      }
    case -32003:
      return {
        title: "Transaction rejected",
        description: "Transaction creation failed",
      }
    case -32004:
      return {
        title: "Method not supported",
        description: "Method is not implemented",
      }
    case -32005:
      return {
        title: "Limit exceeded",
        description: "Request exceeds defined limit",
      }
    case -32006:
      return {
        title: "JSON-RPC version not supported",
        description: "Version of JSON-RPC protocol is not supported",
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

export { processMetaMaskError }
export type { MetaMaskError }
