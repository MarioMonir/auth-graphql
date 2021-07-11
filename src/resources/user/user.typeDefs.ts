import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    accessToken: String!
    refreshToken: String!
    count: Int!
    followers: [User!]
    following: [User!]
    followersCount: Int
    followingCount: Int
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    me: User
    getUsers: [User]!
    getUser(id: ID!): User!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): User!
  }
`;

export default typeDefs;
