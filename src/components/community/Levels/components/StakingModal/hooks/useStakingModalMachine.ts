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
    initial: "initial",
    context: {
      error: null,
    },
    states: {
      initial: {
        on: {
          START: "idle",
          START_AND_SHOW_NOTIFICATION: "showNotification",
        },
      },
      showNotification: {
        on: {
          HIDE_NOTIFICATION: "idle",
          STAKE: "loading",
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
        target: "initial",
        cond: "notSucceeded",
      },
      HARD_RESET: {
        target: "initial",
      },
    },
  },
  {
    guards: {
      notSucceeded: (_, event) => {
        console.log(event)
        return true
      },
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
  const [tokenAllowance] = useTokenAllowance()
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
    console.log(allowanceState.value)
  }, [allowanceState])

  useEffect(() => {
    stakingSend("SOFT_RESET")
  }, [tokenAllowance, stakingSend])

  useEffect(() => {
    stakingSend("HARD_RESET")
  }, [account, stakingSend])

  return {
    allowanceState,
    stakingState,
    allowanceSend,
    stakingSend,
  }
}

export default useStakingModalMachine
