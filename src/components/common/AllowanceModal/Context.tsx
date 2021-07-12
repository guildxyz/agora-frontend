import useTokenAllowanceMachine from "components/community/hooks/useTokenAllowanceMachine"
import React, { createContext, useContext } from "react"
import type { Token } from "temporaryData/types"

type Props = {
  token: Token
  children: JSX.Element
}

const AllowanceContext = createContext(null)

const AllowanceProvider = ({ token, children }: Props): JSX.Element => {
  const [state, send] = useTokenAllowanceMachine(token)

  return (
    <AllowanceContext.Provider value={{ state, send, token }}>
      {children}
    </AllowanceContext.Provider>
  )
}

const useAllowance = () => useContext(AllowanceContext)

export { useAllowance, AllowanceProvider }
