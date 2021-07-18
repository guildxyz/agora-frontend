import { useMachine } from "@xstate/react"
import { createMachine, DoneInvokeEvent } from "xstate"

const levelDataMachine = createMachine<any, DoneInvokeEvent<any>>({
  id: "levelData",
  initial: "idle",
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
        FOCUSOUT: { target: "idle" },
        MODALIN: { target: "modalfocus" },
      },
    },
    modalfocus: {
      on: {
        MODALOUT: { target: "idle" },
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
})

// isModalOpen-t átadni + guard!
const useLevelDataMachine = (isModalOpen: boolean): any => {
  const [state, send] = useMachine(levelDataMachine)

  // TODO...

  return [state, send]
}

export default useLevelDataMachine
