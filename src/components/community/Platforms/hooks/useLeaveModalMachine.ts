import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { SignErrorType } from "./usePersonalSign"

type ContextType = {
  error: SignErrorType | null
  platform: string
  communityId: number
  address: string
}

// ! This is a dummy function for the demo !
// Depending on what the returned error will look like, we might need to add a new type to ErrorType in Error.tsx
const leavePlatform = async (
  address: string,
  platform: string,
  communityId: number
): Promise<SignErrorType | null> => {
  // eslint-disable-next-line no-console
  console.log({ address, platform, communityId })
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          code: 1,
          message: "Not implemented",
        }),
      1000
    )
  })
}

const leaveModalMachine = (initialContext) =>
  createMachine<ContextType, DoneInvokeEvent<any>>(
    {
      initial: "initial",
      states: {
        initial: {
          on: { LEAVE_IN_PROGRESS: "loading" },
        },
        loading: {
          on: {
            MODAL_CLOSED: "initial",
          },
          invoke: {
            id: "personalSign",
            src: ({ address, platform, communityId }) =>
              leavePlatform(address, platform, communityId),
            onDone: {
              // Some kind of success state?
              target: "initial",
            },
            onError: {
              target: "error",
            },
          },
        },
        error: {
          on: { LEAVE_IN_PROGRESS: "loading", MODAL_CLOSED: "initial" },
          entry: "setError",
          exit: "removeError",
        },
      },
      context: initialContext,
    },
    {
      actions: {
        setError: assign({
          error: (_, event) => event.data,
        }),
        removeError: assign({
          error: () => null,
        }),
      },
    }
  )

const useLeaveModalMachine = (platform: string): any => {
  const { id: communityId } = useCommunity()
  const { account } = useWeb3React()

  return useMachine(
    leaveModalMachine({
      error: null,
      platform,
      communityId,
      address: account,
    })
  )
}

export default useLeaveModalMachine
