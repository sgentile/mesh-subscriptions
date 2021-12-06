const { buildSchema, Source } = require('graphql');

const source = new Source(/* GraphQL */`
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}

type Query {
  getMessages: [Message!]!
}

type Message {
  content: String!
}

type Mutation {
  createNewMessage(messageInput: MessageInput!): Message!
}

input MessageInput {
  content: String!
}

type Subscription {
  newMessage: Message!
}
`, `.mesh/sources/MessageService/schema.graphql`);

module.exports = buildSchema(source, {
  assumeValid: true,
  assumeValidSDL: true
});