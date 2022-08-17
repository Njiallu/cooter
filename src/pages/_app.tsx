// src/pages/_app.tsx
// Trpc
import { withTRPC } from "@trpc/next"
import superjson from "superjson"
// Next
import { AppRouter } from "../server/router"
import { AppProps } from "next/app"
import Head from "next/head"
import { GetServerSidePropsContext, NextPageContext } from "next"
// Hooks
import { useRouter } from "next/router"
import { useState } from "react"
import { getCookie, setCookie } from "cookies-next"
// UI components
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
// Global components
import theme from "../features/Theme"
import Shell from "../components/Shell"

function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme)

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark")
    setColorScheme(nextColorScheme)
    setCookie("colorscheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    })
  }

  const router = useRouter()

  return (
    <>
      <Head>
        <title>Mantine next example</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ ...theme, colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <Shell path={router.asPath}>
              <Component {...pageProps} />
            </Shell>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  )
}
// Disabled for now as it breaks the colorscheme persistance

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""
  }
  if (process.browser) return "" // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

const AppExtended = withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(App)

AppExtended.getInitialProps = ({
  ctx,
}: {
  ctx: GetServerSidePropsContext
} & NextPageContext) => ({
  colorScheme: getCookie("colorscheme", ctx) ?? "light",
})

export default AppExtended
// export default App
