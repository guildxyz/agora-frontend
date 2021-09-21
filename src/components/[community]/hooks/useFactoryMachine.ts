import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useShowErrorToast from "components/admin/hooks/useShowErrorToast"
import useSpaceFactory from "components/admin/hooks/useSpaceFactory"
import { Chains } from "connectors"
import { Machine } from "temporaryData/types"
import { createMachine, DoneInvokeEvent } from "xstate"

// TODO: remove logs before merge
const factoryMachine = createMachine({
  initial: "idle",
  states: {
    idle: {
      entry: () => console.log("Entered state: idle"),
      on: {
        DEPLOY: "createSpace",
      },
    },
    createSpace: {
      entry: () => console.log("Entered state: createSpace"),
      invoke: {
        src: "createSpace",
        onDone: "success",
        onError: "error",
      },
    },
    error: {
      // TODO: Add error toasts
      entry: "showErrorToast",
      on: {
        DEPLOY: "createSpace",
      },
    },
    success: {
      // TODO: Add success toasts
      entry: () => console.log("Entered state: success"),
    },
  },
  on: {
    HAS_CONTRACT: "success",
    RESET: "idle",
  },
})

const useFactoryMachine = (): Machine<any> => {
  const { chainId, account } = useWeb3React()
  const { communityData } = useCommunityData()
  const showErrorToast = useShowErrorToast()
  const tokenAddress = communityData.chainData.token.address // No conditional chaining, DeploySpace only renders if this data is available
  const { updateData } = useSpaceFactory(tokenAddress)

  const [state, send] = useMachine(factoryMachine, {
    services: {
      createSpace: async (_, event: DoneInvokeEvent<string>) => {
        try {
          await fetch("/api/createSpace", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenAddress,
              dataToSign: event.data,
              networkName: Chains[chainId],
              account,
            }),
          }).then(async (response) => {
            const body = await response.json()
            if (response.ok) return body
            throw body
          })
          const updated = await updateData()
          const index = communityData.allChainData.findIndex(
            (chainData) => chainData.name === Chains[chainId]
          )
          communityData.allChainData[index].contractAddress = updated.contractAddress
          communityData.allChainData[index].stakeToken = updated.stakeToken
          console.log("space created", { chainData: communityData.allChainData })
          /* await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}`,
          {
            method: "patch",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chainData: communityData.allChainData }),
          }
        ) */
        } catch (error) {
          if (error.errorName === "Unauthorized")
            throw new Error("You are not authorized to create this space")
          if (error.errorName === "AlreadyExists")
            throw new Error("A space already exists for this token")
          throw new Error(error.message || "An unknown error occured")
        }
      },
    },
    actions: {
      showErrorToast: (_context, event) => showErrorToast(event.data.message),
    },
  })

  /* useEffect(() => {
    if (typeof contractAddress === "string" && contractAddress !== ZERO_ADDRESS)
      send("HAS_CONTRACT")
    else send("RESET")
  }, [contractAddress, send]) */

  return [state, send]
}

export default useFactoryMachine
