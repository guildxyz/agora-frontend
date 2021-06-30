import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type ContextType = {
  error: Error | null
}

const unstakingModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>({
  initial: "idle",
  context: {
    error: null,
  },
  states: {
    idle: {
      on: {
        UNSTAKE: "loading",
      },
    },
    loading: {
      invoke: {
        src: "unstake",
        onDone: "success",
        onError: "error",
      },
    },
    error: {
      entry: assign({
        error: (_, event) => event.data,
      }),
      exit: assign({
        error: () => null,
      }),
      on: {
        UNSTAKE: "loading",
      },
    },
    success: {},
  },
  on: {
    RESET: {
      target: "idle",
      cond: (_context, _event, condMeta) => condMeta.state.value !== "success",
    },
  },
})

const useUnstakingModalMachine = (): any => {
  const { account } = useWeb3React()

  return useMachine(unstakingModalMachine, {
    services: {
      // TODO: implement unstaking
      unstake: (_, event): Promise<null> =>
        new Promise((resolve, reject) => {
          setTimeout(() => /* reject(Error()) */ resolve(null), 3000)
        }),
    },
  })
}

export default useUnstakingModalMachine
