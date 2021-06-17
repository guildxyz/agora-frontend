import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { useMachine } from "@xstate/react"

type TransactionsCheckResult = "pending" | "approved" | "notfound"

type ContextType = {
  address: string
  error: any
  confirmationDismissed: boolean
}

// ! DUMMY!
const checkAllowance = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  address: string
): Promise<TransactionsCheckResult | Error> =>
  new Promise((resolve, _) => {
    setTimeout(() => resolve("notfound"), 5000)
  })

// ! DUMMY!
const confirmPermission = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  address: string
): Promise<void> =>
  new Promise((resolve, _) => {
    setTimeout(() => resolve(), 2000)
  })

// ! DUMMY!
const confirmTransaction = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  address: string
): Promise<void> =>
  new Promise((resolve, _) => {
    setTimeout(() => resolve(), 2000)
  })

// ! DUMMY!
const stake = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  address: string
): Promise<void> =>
  new Promise((resolve, _) => {
    setTimeout(() => resolve(), 2000)
  })

const machine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "initial",
    context: {
      address: null,
      error: null,
      confirmationDismissed: false,
    },
    states: {
      initial: {
        invoke: {
          src: "checkAllowance",
          onDone: [
            {
              target: "noPermission",
              cond: "noPermission",
            },
            {
              target: "approveTransactionPending",
              cond: "transactionPending",
            },
            {
              target: "idle",
              cond: "approved",
              actions: "dismissConfirmation",
            },
          ],
          onError: {
            target: "approveTransactionError",
            actions: "setError",
          },
        },
      },
      noPermission: {
        on: {
          ALLOW: "approving",
        },
      },
      approving: {
        invoke: {
          src: "confirmPermission",
          onDone: {
            target: "approveTransactionPending",
          },
          onError: {
            target: "approveTransactionError",
            actions: "setError",
          },
        },
      },
      approveTransactionPending: {
        invoke: {
          src: "confirmTransaction",
          onDone: {
            target: "idle",
          },
          onError: {
            target: "approveTransactionError",
            actions: "setError",
          },
        },
      },
      approveTransactionError: {
        on: {
          ALLOW: "approving",
        },
        exit: "removeError",
      },
      idle: {
        on: {
          STAKE: "staking",
          DISMISS_CONFIRMATION: {
            target: "idle",
            actions: "dismissConfirmation",
          },
        },
        exit: "dismissConfirmation",
      },
      staking: {
        invoke: {
          src: "stake",
          onDone: {
            target: "success",
          },
          onError: {
            target: "stakingError",
            actions: "setError",
          },
        },
      },
      stakingError: {
        entry: "dismissConfirmation",
        on: {
          STAKE: "staking",
        },
      },
      success: {},
    },
    on: {
      CLOSE_MODAL: {
        target: "initial",
        actions: "defaultContext",
        cond: "notSucceeded",
      },
    },
  },
  {
    guards: {
      noPermission: (_, event: DoneInvokeEvent<any>) => {
        console.log(`noPermission guard: ${event.data === "notfound"}`)
        return event.data === "notfound"
      },
      transactionPending: (_, event: DoneInvokeEvent<any>) => {
        console.log(`transactionPending guard: ${event.data === "pending"}`)
        return event.data === "pending"
      },
      approved: (_, event: DoneInvokeEvent<any>) => {
        console.log(`approved guard: ${event.data === "approved"}`)
        return event.data === "approved"
      },
      notSucceeded: (_context, _event, condMeta) =>
        condMeta.state.value !== "success",
    },
    services: {
      confirmPermission: (context: ContextType) =>
        confirmPermission(context.address),
      checkAllowance: (context: ContextType) => checkAllowance(context.address),
      confirmTransaction: (context: ContextType) =>
        confirmTransaction(context.address),
      stake: (context: ContextType) => stake(context.address),
    },
    actions: {
      removeError: assign({ error: null }),
      setError: assign({ error: (_, event) => event.data }),
      dismissConfirmation: assign<ContextType, DoneInvokeEvent<any>>({
        confirmationDismissed: true,
      }),
      defaultContext: assign<ContextType, DoneInvokeEvent<any>>({
        error: null,
        confirmationDismissed: false,
      }),
    },
  }
)

const useStakingModalMachine = (): any => useMachine(machine)

export default useStakingModalMachine
