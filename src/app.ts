import connect from "./utils/database/database.connection.js";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import resolvers from "./resources/user/user.resolvers";
import typeDefs from "./resources/user/user.typeDefs";

const port = process.env.PORT || 4000;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({ req, res }),
  });

  await connect();

  const app = express();
  app.use(cors({ credentials: true }));
  app.use(cookieParser());
  server.applyMiddleware({ app });

  app.listen({ port }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
