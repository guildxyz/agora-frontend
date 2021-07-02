import {
  createMachine,
  DoneInvokeEvent,
  EventData,
  Sender,
  State,
  assign,
  StateMachine,
} from "xstate"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import useTokenAllowance from "./useTokenAllowance"
import { useCommunity } from "../Context"

type AllowanceCheckEvent =
  | {
      type: "PERMISSION_NOT_GRANTED"
    }
  | {
      type: "PERMISSION_IS_PENDING"
    }
  | {
      type: "PERMISSION_IS_GRANTED"
    }

type ContextType = {
  error: any
}

// there is no syntax highlight for the send function without this type
type ReturnType = StateMachine<
  ContextType,
  any,
  DoneInvokeEvent<any> | AllowanceCheckEvent
>

const allowanceMachine = createMachine<
  ContextType,
  DoneInvokeEvent<any> | AllowanceCheckEvent
>(
  {
    id: "allowance",
    initial: "initial",
    context: {
      error: null,
    },
    states: {
      initial: {
        invoke: {
          src: "checkAllowance",
          onError: "error",
        },
        on: {
          PERMISSION_NOT_GRANTED: "idle",
          PERMISSION_IS_PENDING: "loading.transaction",
          PERMISSION_IS_GRANTED: "success",
        },
      },
      idle: {
        on: {
          ALLOW: "loading",
        },
      },
      loading: {
        initial: "permission",
        states: {
          permission: {
            invoke: {
              src: "confirmPermission",
              onDone: "transaction",
              onError: "#allowance.error",
            },
          },
          transaction: {
            invoke: {
              src: "confirmTransaction",
              onDone: "#allowance.notification",
              onError: "#allowance.error",
            },
          },
        },
      },
      error: {
        on: {
          ALLOW: "loading",
        },
        entry: "setError",
        exit: "removeError",
      },
      notification: {
        initial: "showing",
        states: {
          showing: {
            on: {
              HIDE_NOTIFICATION: "hiding",
            },
          },
          hiding: {
            after: {
              500: "#allowance.success",
            },
          },
        },
        on: {
          SOFT_RESET: "#allowance.success",
        },
      },
      success: {
        type: "final",
        on: {
          SOFT_RESET: "success",
        },
      },
    },
    on: {
      SOFT_RESET: "initial", // this is overridden in deeper levels, so the two are not the same
      HARD_RESET: "initial",
    },
  },
  {
    actions: {
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useAllowanceMachine = (): ReturnType => {
  const {
    chainData: {
      token: { address: tokenAddress, name: tokenName },
    },
  } = useCommunity()
  const [tokenAllowance, approve] = useTokenAllowance(tokenAddress, tokenName)
  const { account } = useWeb3React()

  const machine = allowanceMachine.withConfig({
    services: {
      checkAllowance: () => (_send: Sender<AllowanceCheckEvent>) => {
        if (!tokenAllowance) _send("PERMISSION_NOT_GRANTED")
        else _send("PERMISSION_IS_GRANTED")
      },
      confirmPermission: approve,
      confirmTransaction: async (_, event: DoneInvokeEvent<any>) =>
        event.data.wait(),
    },
  })

  return machine
}

export default useAllowanceMachine
