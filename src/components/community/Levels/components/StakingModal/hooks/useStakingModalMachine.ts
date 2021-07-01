import { createMachine, assign, DoneInvokeEvent } from "xstate"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useContract from "hooks/useContract"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useTokenAllowance from "./useTokenAllowance"
import useAllowanceMachine from "./useAllowanceMachine"

type ContextType = {
  error: any
}

const stakingModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    id: "staking",
    initial: "disabled",
    context: {
      error: null,
    },
    states: {
      disabled: {
        on: {
          START: "idle",
        },
      },
      idle: {
        on: {
          STAKE: "loading",
        },
      },
      loading: {
        invoke: {
          src: "stake",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: {
          STAKE: "loading",
        },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        // type: "final",
      },
    },
    on: {
      SOFT_RESET: {
        target: "disabled",
        cond: "notSucceeded",
      },
      HARD_RESET: {
        target: "disabled",
      },
    },
  },
  {
    guards: {
      notSucceeded: (_context, _event, { state: { value } }) => value !== "success",
    },
    actions: {
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useStakingModalMachine = (amount: number): any => {
  const [tokenAllowance, , mutate] = useTokenAllowance()
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const { account } = useWeb3React()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const [allowanceState, allowanceSend] = useAllowanceMachine()
  const [stakingState, stakingSend] = useMachine(stakingModalMachine, {
    services: {
      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx = await contract.deposit(weiAmount)
        return tx
      },
    },
  })

  useEffect(() => {
    console.log(allowanceState.toStrings()[allowanceState.toStrings().length - 1])
  }, [allowanceState])

  useEffect(() => {
    stakingSend("SOFT_RESET")
  }, [tokenAllowance, stakingSend])

  useEffect(() => {
    stakingSend("HARD_RESET")
  }, [account, stakingSend])

  return {
    reset: () => {
      allowanceSend("SOFT_RESET")
      stakingSend("SOFT_RESET")
      mutate()
    },
    allowance: {
      state: allowanceState.toStrings()[allowanceState.toStrings().length - 1],
      context: allowanceState.context,
      send: allowanceSend,
    },
    staking: {
      state: stakingState.toStrings()[stakingState.toStrings().length - 1],
      context: stakingState.context,
      send: stakingSend,
    },
  }
}

export default useStakingModalMachine
