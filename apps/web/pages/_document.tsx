import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import Script from "next/script";
import Favicon from "../components/favicon";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <Favicon />
          <Script
            strategy="beforeInteractive"
            src="/lforms/zone.min.js"
          />
          <Script
            strategy="beforeInteractive"
            src="/lforms/scripts.js"
          />
          <Script
            strategy="beforeInteractive"
            src="/lforms/runtime.js"
          />
          <Script
            strategy="beforeInteractive"
            src="/lforms/polyfills.js"
          />
          <Script
            strategy="beforeInteractive"
            src="/lforms/main.js"
          />
          <Script
            strategy="beforeInteractive"
            src="/lforms/lformsFHIRAll.min.js"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
