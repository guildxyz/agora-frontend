/* eslint-disable react/jsx-props-no-spreading */
import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers"
import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import type { AppProps } from "next/app"
import Chakra from "components/chakra/Chakra"
import "focus-visible/dist/focus-visible"
import { Web3ConnectionManager } from "components/web3Connection/Web3ConnectionManager"
import { IconContext } from "phosphor-react"

const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) =>
  new Web3Provider(provider)

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Chakra cookies={pageProps.cookies}>
    <IconContext.Provider
      value={{
        color: "currentColor",
        size: "1em",
        weight: "bold",
        mirrored: false,
      }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ConnectionManager>
          <Component {...pageProps} />
        </Web3ConnectionManager>
      </Web3ReactProvider>
    </IconContext.Provider>
  </Chakra>
)

export { getServerSideProps } from "components/chakra/Chakra"

export default App
