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
        after: {
          100: "idle",
        },
      },
      idle: {
        on: {
          FOCUSIN: "focus",
          PENDING: "pending",
          ACCESS: "access",
        },
      },
      focus: {
        on: {
          PENDING: "pending",
          ACCESS: "access",
          FOCUSOUT: { target: "idle", cond: "safeToIdle" },
          FORCEFOCUSOUT: "forcedidle",
        },
      },
      pending: {
        on: {
          ACCESS: "access",
          ERROR: "idle",
        },
      },
      access: {
        on: {
          NOACCESS: "idle",
        },
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

  return [state, send]
}

export default useLevelDataMachine
