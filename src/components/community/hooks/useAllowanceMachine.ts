import {
  createMachine,
  DoneInvokeEvent,
  EventData,
  Sender,
  State,
  assign,
  StateMachine,
  spawn,
  sendParent,
  ActorRef,
  SpawnedActorRef,
} from "xstate"
import { useActor, useMachine } from "@xstate/react"
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

type AllowanceContextType = {
  error: any
}
type WrapperContextType = {
  allowance: any
}

const allowanceMachine = createMachine<
  AllowanceContextType,
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
              onDone: {
                target: "#allowance.success",
                actions: "setNotification",
              },
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
      setError: assign<AllowanceContextType, DoneInvokeEvent<any>>({
        error: (_: AllowanceContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useAllowanceMachine = <ChildContextType>(
  consumerMachine,
  consumerMachineOptions
) => {
  const {
    chainData: {
      token: { address: tokenAddress, name: tokenName },
    },
  } = useCommunity()
  const [tokenAllowance, approve] = useTokenAllowance(tokenAddress, tokenName)
  const { account } = useWeb3React()

  const [, , machine] = useMachine<any, any>(allowanceMachine, {
    services: {
      checkAllowance: () => (_send: Sender<AllowanceCheckEvent>) => {
        if (!tokenAllowance) _send("PERMISSION_NOT_GRANTED")
        else _send("PERMISSION_IS_GRANTED")
      },
      confirmPermission: approve,
      confirmTransaction: async (_, event: DoneInvokeEvent<any>) =>
        event.data.wait(),
    },
    actions: {
      notifyParent: (_context, _event, _meta) => {
        console.log({ _context, _event, _meta })
      },
    },
  })

  const wrapperMachine = createMachine<any, any>({
    initial: "allowance",
    context: {
      allowance: null,
      notification: false,
    },
    states: {
      allowance: {
        invoke: {
          id: "allowance",
          src: machine.machine,
          onDone: "consumer",
        },
      },
      consumer: {
        type: "parallel",
        states: {
          notification: {
            initial: "showing",
            states: {
              showing: {
                entry: (context, event, meta) =>
                  console.log({ context, event, meta }),
                on: {
                  HIDE_NOTIFICATION: "hiding",
                },
              },
              hiding: {
                after: {
                  500: "hidden",
                },
              },
              hidden: {
                type: "final",
              },
            },
            on: {
              SOFT_RESET: "notification.hidden",
            },
          },
          consumerMachine,
        },
      },
    },
  })

  const [state, send, service] = useMachine<any, any>(
    wrapperMachine,
    consumerMachineOptions
  )
  const [allowanceState, allowanceSend] = useActor(
    service.initialState.children.allowance
  )
  const softReset = () => allowanceSend({ type: "SOFT_RESET" })

  useEffect(softReset, [tokenAllowance, allowanceSend])

  useEffect(() => console.log(state.toStrings()), [state])

  return {
    state: state
      ?.toStrings()
      [state?.toStrings().length - 1].slice("consumer.consumerMachine.".length),
    error: state.context.error,
    send,
    allowance: {
      state: allowanceState?.toStrings()[allowanceState?.toStrings().length - 1],
      error: allowanceState?.context.error,
      send: (event: string) => allowanceSend({ type: event }),
      softReset,
    },
    notification: {
      state: state
        ?.toStrings()
        [state?.toStrings().length - 2]?.slice("consumer.".length),
      send,
    },
  }
}
export default useAllowanceMachine
