import { IResolvers } from "graphql-tools";
import authController from "../../utils/auth/auth.controller.js";
import crud from "../../utils/crud/crud.js";

const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { req, res }) => await authController.protect(req, res),
    getUser: async (_, { id }) => await crud.findOne("user", { _id: id }),
    getUsers: async () => await crud.findAll("user"),
  },

  Mutation: {
    register: async (_, { username, password }, { res }) =>
      await authController.register({ username, password }, { res }),

    login: async (_, { username, password }, { res }) =>
      await authController.login({ username, password }, { res }),
  },
};

export default resolvers;
