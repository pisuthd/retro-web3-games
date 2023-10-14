import '@/styles/globals.css'
import PanelProvider from "../hooks/usePanel"


export default function App({ Component, pageProps }) {
  return <PanelProvider>
    <Component {...pageProps} />
  </PanelProvider>
}
