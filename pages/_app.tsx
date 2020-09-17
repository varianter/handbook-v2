import { AppProps, Container } from "next/app";
import React from "react";
import "src/app.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Container id="root">
        <Component {...pageProps} />
      </Container>
    </React.StrictMode>
  );
}

export default MyApp;
