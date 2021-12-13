const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const { getBuiltMesh } = require("./.mesh");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
// const handle = app.getRequestHandler();
const port = process.env.APP_PORT || 4444;

async function main() {
  //
  const expressApp = express();

  // bootstrap apollo server
  const { schema } = await getBuiltMesh();
  const apolloServer = new ApolloServer({
    schema,
  });
  apolloServer.applyMiddleware({ app: expressApp });
  //

  // bootstrap apollo client
  await nextApp.prepare();
  expressApp.get("*", nextApp.getRequestHandler());
  //

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

  // expressApp.listen(port, (err) => {
  //   if (err) throw err;
  //   console.log(`[ server ] ready on port ${port}`);
  // });
}
//

// await app.prepare();
// const server = express();
// server.all("*", (req, res) => {
//   return handle(req, res);
// });
// const { schema } = await getBuiltMesh();

// // const app = express();
// const apolloServer = new ApolloServer({
//   schema,
// });
// apolloServer.applyMiddleware({
//   app: server,
//   cors: {
//     origin: true,
//   },
//   async onHealthCheck() {
//     return;
//   },
// });
// const httpServer = http.createServer(server);
// apolloServer.installSubscriptionHandlers(httpServer);

// httpServer.listen({ port, host: "0.0.0.0" }, () => {
//   console.log(
//     `🚀 Server ready at http://0.0.0.0:${port}${apolloServer.graphqlPath}`
//   );
//   console.log(
//     `🚀 Subscriptions ready at ws://0.0.0.0:${port}${apolloServer.subscriptionsPath}`
//   );
// });
//}

main().catch(console.error);
