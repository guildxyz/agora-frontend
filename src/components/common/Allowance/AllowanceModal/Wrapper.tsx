import useTokenAllowanceMachine from "components/community/hooks/useTokenAllowanceMachine"
import React from "react"
import type { Token } from "temporaryData/types"
import { AllowanceContext } from "../hooks/useAllowance"
import Modal from "./Modal"

type Props = {
  token: Token
  isOpen: boolean
  onClose: () => void
  children: JSX.Element | JSX.Element[]
}

const Wrapper = ({ token, isOpen, onClose, children }: Props): JSX.Element => {
  const [state, send] = useTokenAllowanceMachine(token)

  return (
    <AllowanceContext.Provider value={{ state, send, token }}>
      <Modal isOpen={isOpen} onClose={onClose}>
        {children}
      </Modal>
    </AllowanceContext.Provider>
  )
}

export default Wrapper
