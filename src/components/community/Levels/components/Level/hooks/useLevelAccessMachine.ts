import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { useMachine } from "@xstate/react"
import { useWeb3React } from "@web3-react/core"

type ContextType = {
  disabledMessage: any
}

const machine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "initial",
    context: {
      disabledMessage: null,
    },
    states: {
      loading: {
        invoke: {
          src: "checkAccess",
          onDone: [
            {
              target: "disabled",
              cond: "disabled",
            },
            {
              target: "idle",
              cond: "noAccess",
            },
            {
              target: "hasAccess",
              cond: "hasAccess",
            },
          ],
          onError: {
            target: "loading",
          },
        },
      },
      disabled: {},
      idle: {},
      pendingTransaction: {},
      hasAccess: {},
    },
  },
  {
    guards: {
      disabled: (_, event: DoneInvokeEvent<any>) => event.data === "notfound",
      noAccess: (_, event: DoneInvokeEvent<any>) => event.data === "pending",
      hasAccess: (_, event: DoneInvokeEvent<any>) => event.data === "approved",
    },
  }
)

const useStakingModalMachine = (): any => {
  const { account } = useWeb3React()

  return useMachine(machine, {
    services: {
      checkAccess: () =>
        new Promise((resolve, _) => {
          setTimeout(() => resolve("notfound"), 5000)
        }),
    },
  })
}

export default useStakingModalMachine
