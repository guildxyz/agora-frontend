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
  allowance: any
}

const stakingModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    id: "staking",
    initial: "disabled",
    context: {
      error: null,
      allowance: undefined,
    },
    states: {
      disabled: {
        entry: "spawnAllowanceMachine",
        on: {
          PERMISSION_GRANTED: "idle",
          SOFT_RESET_TO_DISABLED: "",
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
      SOFT_RESET_TO_DISABLED: {
        target: "disabled",
        cond: "notSucceeded",
      },
      SOFT_RESET_TO_IDLE: {
        target: "idle",
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
  const {
    chainData: {
      contract: { address: contractAddress },
      token: { address: tokenAddress, name: tokenName },
    },
  } = useCommunity()
  const [tokenAllowance] = useTokenAllowance(tokenAddress, tokenName)
  const { account } = useWeb3React()
  const contract = useContract(contractAddress, AGORA_SPACE_ABI, true)
  const allowanceMachine = useAllowanceMachine()
  const [stakingState, stakingSend] = useMachine(stakingModalMachine, {
    services: {
      stake: async () => {
        const weiAmount = parseEther(amount.toString())
        const tx = await contract.deposit(weiAmount)
        return tx
      },
    },
    actions: {
      spawnAllowanceMachine: assign({
        // Actor will send update event to parent whenever its state changes
        allowance: () => spawn(allowanceMachine, { sync: true }),
      }),
    },
  })
  const { allowance } = stakingState.children
  const machine = spawn(allowance, {
    sync: true,
  })

  // const [allowanceState, allowanceSend] = useActor(allowance)

  useEffect(() => console.log(stakingState.context.allowance?.state), [stakingState])
  useEffect(() => console.log(stakingState.context), [stakingState])

  const softReset = () => {
    stakingSend("SOFT_RESET_TO_DISABLED")
  }

  // useEffect(() => console.log(allowanceState), [allowanceState])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(softReset, [tokenAllowance, stakingSend])

  useEffect(() => {
    stakingSend("HARD_RESET")
  }, [account, stakingSend])

  return {
    softReset: () => {
      softReset()
    },
    /* allowance: {
      state: allowanceState.toStrings()[allowanceState.toStrings().length - 1],
      context: allowanceState.context,
      send: allowanceSend,
    }, */
    staking: {
      state: stakingState.toStrings()[stakingState.toStrings().length - 1],
      context: stakingState.context,
      send: stakingSend,
    },
  }
}

export default useStakingModalMachine
