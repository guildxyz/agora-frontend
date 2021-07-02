import { createMachine, assign, DoneInvokeEvent, spawn, StateMachine } from "xstate"
import { useActor, useMachine } from "@xstate/react"
import { useEffect } from "react"
import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useTokenAllowance from "../../../../hooks/useTokenAllowance"
import useAllowanceMachine from "../../../../hooks/useAllowanceMachine"

type ContextType = {
  error: any
}

const stakingMachine = {
  id: "staking",
  initial: "idle",
  context: {
    error: null,
  },
  states: {
    idle: {
      on: {
        STAKE: "#staking.loading",
      },
    },
    loading: {
      invoke: {
        src: "stake",
        onDone: "#staking.success",
        onError: "#staking.error",
      },
    },
    error: {
      on: {
        STAKE: "#staking.loading",
      },
      entry: "setError",
      exit: "removeError",
    },
    success: {
      // type: "final",
    },
  },
  on: {
    SOFT_RESET_TO_DISABLED: {
      target: "#staking.idle",
      cond: "notSucceeded",
    },
    SOFT_RESET_TO_IDLE: {
      target: "#staking.idle",
      cond: "notSucceeded",
    },
    HARD_RESET: {
      target: "#staking.idle",
    },
  },
}

const useStakingModalMachine = (amount: number): any => {
  const {
    chainData: {
      contract: { address: contractAddress },
      token: { address: tokenAddress, name: tokenName },
    },
  } = useCommunity()
  const [tokenAllowance] = useTokenAllowance(tokenAddress, tokenName)
  const { account } = useWeb3React()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)
  const { state, send, error, allowance, notification } =
    useAllowanceMachine<ContextType>(stakingMachine, {
      services: {
        stake: async () => {
          const weiAmount = parseEther(amount.toString())
          const tx = await contract.deposit(weiAmount)
          return tx
        },
      },
      actions: {
        removeError: assign({ error: null }),
        setError: assign<ContextType, DoneInvokeEvent<any>>({
          error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
        }),
      },
      guards: {
        notSucceeded: (_context, _event, { state: { value } }) =>
          value !== "success",
      },
    })

  const softReset = () => {
    send("SOFT_RESET_TO_DISABLED")
  }

  useEffect(softReset, [tokenAllowance, send])

  useEffect(() => console.log(state), [state])

  useEffect(() => {
    send("HARD_RESET")
  }, [account, send])

  return {
    softReset: () => {
      softReset()
      allowance.softReset()
    },
    allowance,
    notification,
    staking: {
      state,
      error,
      send,
    },
  }
}

export default useStakingModalMachine
