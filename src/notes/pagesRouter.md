# _app.tsx is the global wrapper for pages

```TS
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return <Component {...pageProps} />;
}
```
_app.tsx is analogous to the role of app/layout.tsx, this is where you will often find Redux, React Query, authentication providers, themes etc, as an example


# _document.tsx controls the overall HTML document structure
```TS
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```