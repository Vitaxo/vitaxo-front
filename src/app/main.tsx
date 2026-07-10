import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { App } from ".";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://801ac57e062e7783ad44b42a6a0ef7bf@o4511711539363840.ingest.de.sentry.io/4511711861276752",
  dataCollection: {
  }
});


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
