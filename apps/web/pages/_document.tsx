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
            src="https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0-beta.6/webcomponent/assets/lib/zone.min.js"
          />
          <Script
            strategy="beforeInteractive"
            src="https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0-beta.6/webcomponent/scripts.js"
          />
          <Script
            strategy="beforeInteractive"
            src="https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0-beta.6/webcomponent/runtime-es5.js"
          />
          <Script
            strategy="beforeInteractive"
            src="https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0-beta.6/webcomponent/polyfills-es5.js"
          />
          <Script
            strategy="beforeInteractive"
            src="https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0-beta.6/webcomponent/main-es5.js"
          />
          <Script
            strategy="beforeInteractive"
            src="https://clinicaltables.nlm.nih.gov/lforms-versions/30.0.0-beta.6/fhir/lformsFHIRAll.min.js"
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
