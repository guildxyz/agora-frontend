import Document, { Html, Head, Main, NextScript } from "next/document"
import { ColorModeScript } from "@chakra-ui/react"
import theme from "../theme"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head>
          <link
            rel="preload stylesheet"
            as="style"
            href="https://rsms.me/inter/inter.css"
            crossOrigin="anonymous"
          />
          <link
            rel="preload stylesheet"
            as="style"
            href="fonts/fonts.css"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
