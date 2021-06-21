/* eslint-disable @typescript-eslint/dot-notation */
import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { useMachine } from "@xstate/react"
import { parseEther } from "@ethersproject/units"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useTokenAllowance from "./useTokenAllowance"

type TransactionsCheckResult = "pending" | "approved" | "noPermission"

type ContextType = {
  error: any
  confirmationDismissed: boolean
}

const machine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "initial",
    context: {
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
        console.log(`noPermission guard: ${event.data === "noPermission"}`)
        return event.data === "noPermission"
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

const useStakingModalMachine = (amount: number): any => {
  const [tokenAllowance, approve] = useTokenAllowance()
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)

  return useMachine(machine, {
    services: {
      checkAllowance: async () => {
        if (!tokenAllowance) return "noPermission"
        return "approved"
      },
      confirmPermission: approve,
      confirmTransaction: async (_, event) => event.data.wait(),

      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx = await contract.deposit(weiAmount)
        return tx
      },
    },
  })
}

export default useStakingModalMachine
