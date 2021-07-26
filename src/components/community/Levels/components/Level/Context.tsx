import React, { createContext, useContext } from "react"
import { Level } from "temporaryData/types"

type Props = {
  data: Level
  children: JSX.Element
}

const LevelContext = createContext<Level>(null)

const LevelProvider = ({ data, children }: Props): JSX.Element => (
  <LevelContext.Provider value={data}>{children}</LevelContext.Provider>
)

const useLevelData = (): Level => useContext(LevelContext)

export { useLevelData, LevelProvider }
