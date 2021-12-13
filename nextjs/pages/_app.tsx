import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import type { AppProps } from "next/app";
import React from "react";
import "../styles/globals.css";

const wsLink = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: `ws://localhost:4444/graphql`,
      options: {
        reconnect: true,
      },
    })
  : null;

const httplink = new HttpLink({
  uri: "http://localhost:4444/graphql",
  credentials: "same-origin",
});

const link =
  wsLink && process.browser
    ? split(
        // only create the split in the browser
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httplink
      )
    : httplink;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache: new InMemoryCache(),
  });
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={createApolloClient()}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
