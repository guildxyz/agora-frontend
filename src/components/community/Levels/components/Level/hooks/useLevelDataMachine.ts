/*
- LevelData típusú context
- idle, focus, pending, access state-k
*/

import { useMachine } from "@xstate/react"
import { createMachine, DoneInvokeEvent, assign } from "xstate"
import { useEffect } from "react"

type ContextType = {
  index: number
  isDisabled: boolean
  element: HTMLElement
}

const levelDataMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    id: "levelData",
    initial: "idle",
    context: {
      index: null,
      isDisabled: true,
      element: null,
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
        isDisabled: (_: ContextType, event: DoneInvokeEvent<any>) =>
          event.data?.isDisabled,
        element: (context: ContextType, event: DoneInvokeEvent<any>) =>
          !context.element && event.data?.element,
      }),
    },
  }
)

const useLevelDataMachine = (index: number): any => {
  const [state, send] = useMachine(levelDataMachine)

  useEffect(() => {
    send("LOAD")
  }, [index, send])

  return [state, send]
}

export default useLevelDataMachine
