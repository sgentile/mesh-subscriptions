import { AuthenticationError } from "apollo-server-express";
import { PubSubEngine } from "graphql-subscriptions";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  PubSub,
  Query,
  Root,
  Subscription,
} from "type-graphql";

@InputType()
class MessageInput {
  @Field()
  content: string;
}

@ObjectType()
class Message {
  @Field()
  content: string;
}

export class MessageResolver {
  @Mutation((returns) => Message)
  async createNewMessage(
    @Arg("messageInput") messageInput: MessageInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const message = {
      content: messageInput.content,
    };

    await pubSub.publish("NEW_MESSAGE", message);
    return message;
  }

  @Subscription({
    topics: "NEW_MESSAGE",
    filter: ({ payload, args }) => args.groupId === payload.groupId,
  })
  // @ts-ignore
  async newMessage(@Root() messagePayload: Message): Message {
    // Ensure group exists
    return messagePayload;
  }

  @Query((returns) => [Message])
  async getMessages() {
    // Ensure group exists
    return [
      {
        content: "Test 1",
      },
    ];
  }
}
