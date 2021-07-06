import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import useUnstake from "./useUnstake"

type ContextType = {
  error: Error | null
}

const unstakingModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
    },
    states: {
      idle: {
        on: {
          UNSTAKE: "waitingConfirmation",
        },
      },
      waitingConfirmation: {
        invoke: {
          src: "unstake",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: {
          UNSTAKE: "waitingConfirmation",
          CLOSE_MODAL: "idle",
        },
        entry: "setError",
        exit: "removeError",
      },
      success: {},
    },
    on: {
      RESET: "idle",
    },
  },
  {
    actions: {
      removeError: assign<ContextType, DoneInvokeEvent<any>>({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useUnstakingModalMachine = (): any => {
  const { unstake } = useUnstake()
  const { account, chainId } = useWeb3React()
  const [state, send] = useMachine(unstakingModalMachine, { services: { unstake } })

  useEffect(() => {
    send("RESET")
  }, [account, chainId, send])

  return [state, send]
}

export default useUnstakingModalMachine
