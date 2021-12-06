import { PubSub } from "graphql-subscriptions";
import { Message } from "models";
import { TypedPubSub } from "typed-graphql-subscriptions";

export type PubSubChannels = {
  //   newLink: [{ createdLink: Link }];
  //   newVote: [{ createdVote: Vote }];
  newMessage: [message: Message];
};

export const pubSub = new TypedPubSub<PubSubChannels>(new PubSub());
