import { createContext, useContext } from "react"

const AllowanceContext = createContext(null)

const useAllowance = () => useContext(AllowanceContext)

export { useAllowance, AllowanceContext }
