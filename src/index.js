import React from "react";
import ReactDOM from "react-dom";
import App from "App";
import "./index.css";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/techpro-dashboard-react.scss";

import { QueryClient, QueryClientProvider } from "react-query";

ReactDOM.render(
  <QueryClientProvider client={new QueryClient()}>
    <App />
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>,
  document.getElementById("root")
);
