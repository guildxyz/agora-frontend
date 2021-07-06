import { parseEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import useContract from "hooks/useContract"
import { useEffect } from "react"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"

type ContextType = {
  error: Error | null
}

const unstakingModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
    },
    states: {
      idle: {
        on: {
          UNSTAKE: "waitingConfirmation",
        },
      },
      waitingConfirmation: {
        invoke: {
          src: "unstake",
          onDone: "success",
          onError: "error",
        },
      },
      error: {
        on: {
          UNSTAKE: "waitingConfirmation",
          CLOSE_MODAL: "idle",
        },
        entry: "setError",
        exit: "removeError",
      },
      success: {},
    },
    on: {
      RESET: "idle",
    },
  },
  {
    actions: {
      removeError: assign<ContextType, DoneInvokeEvent<any>>({ error: null }),
      setError: assign<ContextType, DoneInvokeEvent<any>>({
        error: (_: ContextType, event: DoneInvokeEvent<any>) => event.data,
      }),
    },
  }
)

const useUnstakingModalMachine = (): any => {
  const {
    chainData: {
      contract: { address },
      stakeToken,
    },
  } = useCommunity()
  const { data: staked } = useBalance(stakeToken)
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const { account, chainId } = useWeb3React()
  const [state, send] = useMachine(unstakingModalMachine, {
    services: {
      unstake: async () => {
        const weiAmount = parseEther(staked.toString())
        const tx = await contract.withdraw(weiAmount)
        return tx
      },
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, chainId, send])

  return [state, send]
}

export default useUnstakingModalMachine
