import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"

type ContextType = {
  error: any
}

const stakingMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
    },
    states: {
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
          RESET: "idle",
        },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        // type: "final",
      },
    },
    on: {
      HARD_RESET: "idle",
    },
  },
  {
    actions: {
      removeError: assign({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useStakingModalMachine = (amount: number): any => {
  const {
    chainData: {
      contract: { address: contractAddress },
    },
  } = useCommunity()
  const { account } = useWeb3React()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)

  const [state, send] = useMachine<any, any>(stakingMachine, {
    services: {
      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx = await contract.deposit(weiAmount)
        return tx
      },
    },
  })

  useEffect(() => {
    send("HARD_RESET")
  }, [account, send])

  // useEffect(() => console.log(state), [state])

  return [state, send]
}

export default useStakingModalMachine
