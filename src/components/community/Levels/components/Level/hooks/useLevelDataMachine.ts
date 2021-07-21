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
      forcedidle: {
        on: {
          IDLE: { target: "idle" },
        },
      },
      idle: {
        on: {
          FOCUSIN: { target: "focus" },
          MOUSEFOCUSIN: { target: "focus" },
          PENDING: { target: "pending" },
          ACCESS: { target: "access" },
        },
      },
      focus: {
        on: {
          PENDING: { target: "pending" },
          ACCESS: { target: "access" },
          FOCUSOUT: { target: "idle", cond: "safeToIdle" },
          FORCEFOCUSOUT: { target: "forcedidle" },
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
      safeToIdle: (context) => !context.isModalOpen,
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

  useEffect(() => {
    if (state.value === "forcedidle") {
      send("IDLE", { delay: 100 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return [state, send]
}

export default useLevelDataMachine
