import { useMachine } from "@xstate/react"
import { createMachine, DoneInvokeEvent } from "xstate"
import { useEffect } from "react"

const levelDataMachine = createMachine<any, DoneInvokeEvent<any>>(
  {
    id: "levelData",
    initial: "idle",
    context: {
      isModalOpen: false,
    },
    states: {
      idle: {
        on: {
          FOCUSIN: { target: "focus" },
          PENDING: { target: "pending" },
          ACCESS: { target: "access" },
        },
      },
      focus: {
        on: {
          PENDING: { target: "pending" },
          ACCESS: { target: "access" },
          FOCUSOUT: { target: "idle", cond: "modalIsNotOpened" },
        },
      },
      pending: {
        on: {
          ACCESS: { target: "access" },
          ERROR: { target: "idle" },
        },
      },
      access: {
        on: {
          NOACCESS: "idle",
        },
      },
    },
    on: {
      LOAD: {
        target: "idle",
      },
    },
  },
  {
    guards: {
      modalIsNotOpened: (context) => !context.isModalOpen,
    },
  }
)

const useLevelDataMachine = (hasAccess: boolean, isModalOpen: boolean): any => {
  const [state, send] = useMachine(levelDataMachine)

  // Transition to the access state
  useEffect(() => {
    if (hasAccess) {
      send("ACCESS")
      return
    }
    send("NOACCESS")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess])

  useEffect(() => {
    state.context.isModalOpen = isModalOpen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen])

  return [state, send]
}

export default useLevelDataMachine
