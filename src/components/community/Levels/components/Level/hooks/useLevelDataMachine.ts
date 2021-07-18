/*
- LevelData típusú context
- idle, focus, pending, access state-k
*/

import { useMachine } from "@xstate/react"
import { createMachine, DoneInvokeEvent, assign } from "xstate"

type ContextType = {
  index: number
}

const levelDataMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    id: "levelData",
    initial: "idle",
    context: {
      index: null,
    },
    states: {
      idle: {
        entry: "updateLevelData",
        on: {
          FOCUSIN: { target: "focus" },
          PENDING: { target: "pending" },
          ACCESS: { target: "access" },
        },
      },
      focus: {
        entry: "updateLevelData",
        on: {
          PENDING: { target: "pending" },
          ACCESS: { target: "access" },
          FOCUSOUT: { target: "idle" },
          MODALIN: { target: "modalfocus" },
        },
      },
      modalfocus: {
        entry: "updateLevelData",
        on: {
          MODALOUT: { target: "idle" },
        },
      },
      pending: {
        entry: "updateLevelData",
        on: {
          ACCESS: { target: "access" },
          ERROR: { target: "idle" },
        },
      },
      access: {
        entry: "updateLevelData",
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
    actions: {
      updateLevelData: assign<ContextType, DoneInvokeEvent<any>>({
        index: (context: ContextType, event: DoneInvokeEvent<any>) =>
          !context.index && event.data?.index,
      }),
    },
  }
)

const useLevelDataMachine = (): any => {
  const [state, send] = useMachine(levelDataMachine)

  return [state, send]
}

export default useLevelDataMachine
