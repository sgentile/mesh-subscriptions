const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const { getBuiltMesh } = require("./.mesh");

async function main() {
  const { schema } = await getBuiltMesh();

  const app = express();
  const server = new ApolloServer({
    schema,
  });
  server.applyMiddleware({
    app,
    cors: {
      origin: true,
    },
    async onHealthCheck() {
      return;
    },
  });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  const port = process.env.APP_PORT || 4000;
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    console.log(
      `🚀 Server ready at http://0.0.0.0:${port}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://0.0.0.0:${port}${server.subscriptionsPath}`
    );
  });
}

main().catch(console.error);
