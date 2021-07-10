import { IResolvers } from "graphql-tools";
import { register, login } from "../../utils/auth/auth.controller.js";
import crud from "../../utils/crud/crud.js";

const resolvers: IResolvers = {
  Query: {
    getUser: async (_, { id }) => await crud.findOne("user", { _id: id }),
    getUsers: async () => await crud.findAll("user"),
  },

  Mutation: {
    register: async (_, { username, password }) =>
      await register({ username, password }),

    login: async (_, { username, password }, { res, req }) => {
      return await login({ username, password }, { res });
    },
  },
};

export default resolvers;
