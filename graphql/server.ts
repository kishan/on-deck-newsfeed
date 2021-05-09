import {ApolloServer, gql} from 'apollo-server-micro'
import * as resolvers from './resolvers'

const typeDefs = gql`
  type Project {
    id: Int!
    name: String!
    description: String!
    icon_url: String!
    users: [User!]!
  }

  type User {
    id: Int!
    name: String!
    bio: String!
    avatar_url: String!
    fellowship: String!
    projects: [Project!]!
  }

  type Announcement {
    id: Int!
    fellowship: String!
    title: String!
    body: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    nextCursor: String!
  }

  type NewsfeedItem {
    itemType: String!
    itemId: Int!
    title: String!
    description: String!
    created_ts: String!
    fellowship: String
    imageUrl: String
    users: [User!]
    projects: [Project!]
  }

  type Newsfeed {
    pageInfo: PageInfo!
    items: [NewsfeedItem!]!
  }

  type Query {
    project(id: Int!): Project!
    user(id: Int!): User!
    announcement(id: Int!): Announcement!
    newsfeed(fellowship: String!, limit: Int, cursor: String): Newsfeed!
  }
`;

export const server = new ApolloServer({typeDefs, resolvers})
