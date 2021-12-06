import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { MessageResolver } from "./MessageResolver";

async function main() {
  const schema = await buildSchema({
    resolvers: [MessageResolver],
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
    validate: false,
  });

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

  const port = process.env.APP_PORT || 9001;
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
