import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"
import { MetaMaskError } from "utils/processMetaMaskError"
import { assign, createMachine, DoneInvokeEvent } from "xstate"
import usePersonalSign from "../../JoinModal/hooks/usePersonalSign"

type InviteData = {
  inviteLink: string
  joinCode?: number
}

const initialInviteData: InviteData = { inviteLink: "", joinCode: null }

type ContextType = {
  error: MetaMaskError | Response | Error | null
  inviteData: InviteData
  accessToken?: string
  tokenType?: string
  id: string
}

const joinModalMachine = createMachine<ContextType, DoneInvokeEvent<any>>(
  {
    initial: "idle",
    context: {
      error: null,
      inviteData: initialInviteData,
      accessToken: null,
      tokenType: null,
      id: null,
    },
    states: {
      idle: {
        on: {
          AUTH: "auth",
          AUTHDONE: "fetchingUserData",
        },
      },
      auth: {
        on: {
          CLOSE_MODAL: "idle",
        },
        entry: "auth",
      },
      fetchingUserData: {
        invoke: {
          src: "fetchUserData",
          onDone: "signIdle",
          onError: "authError",
        },
      },
      signIdle: {
        on: {
          SIGN: "signing",
        },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: "success",
          onError: "signError",
        },
      },
      signError: {
        on: { SIGN: "signing", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      authError: {
        on: { AUTH: "auth", CLOSE_MODAL: "idle" },
        entry: "setError",
        exit: "removeError",
      },
      success: {
        entry: (context, event) => {
          console.log(context.id, event.data)
        },
      },
    },
    on: {
      RESET: {
        target: "idle",
      },
    },
  },
  {
    actions: {
      setError: assign({
        error: (_, event) => event.data,
      }),
      removeError: assign({
        error: () => null,
      }),
    },
  }
)

const useJoinModalMachine = (): any => {
  const { account } = useWeb3React()
  const sign = usePersonalSign()

  const [state, send] = useMachine(joinModalMachine, {
    services: {
      sign: () => sign("Please sign this message to generate your invite link"),
      fetchUserData: async (context) =>
        fetch("https://discord.com/api/users/@me", {
          headers: {
            authorization: `${context.tokenType} ${context.accessToken}`,
          },
        })
          .then((result) => result.json())
          .then((response) => {
            state.context.id = response.id
          }),
    },
  })

  useEffect(() => {
    send("RESET")
  }, [account, send])

  return [state, send]
}

export default useJoinModalMachine
