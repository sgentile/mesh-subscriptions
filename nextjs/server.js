const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const { getBuiltMesh } = require("./.mesh");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const port = process.env.APP_PORT || 4444;

async function main() {
  const expressApp = express();
  // expressApp.use

  // Bootstrap Apollo Server
  // Use Apollo server as express middleware through 'applyMiddleware'
  const { schema } = await getBuiltMesh();
  const apolloServer = new ApolloServer({
    schema,
  });
  apolloServer.applyMiddleware({
    app: expressApp,
    cors: {
      origin: true,
    },
  });

  // Bootstrap Client App
  // Next.js creates a handler that can be used as express middleware
  await nextApp.prepare();
  expressApp.get("*", nextApp.getRequestHandler());

  // Set up Subscriptions
  const httpServer = http.createServer(expressApp);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    console.log(
      `🚀 Server ready at http://0.0.0.0:${port}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://0.0.0.0:${port}${apolloServer.subscriptionsPath}`
    );
  });
}

main().catch(console.error);
