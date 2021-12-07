import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

// export type Message = {
//   content: string;
// };

export type MessageInput = {
  content: string;
};

const pubSub = new PubSub();

@Resolver('Message')
export class MessageResolver {
  @Subscription('newMessage', {
    resolve: (value) => {
      console.log('newMessage', value);
      return value;
    },
  })
  commentAdded() {
    return pubSub.asyncIterator('newMessage');
  }

  @Mutation()
  //args: { messageInput: MessageInput },
  async createNewMessage(@Args('messageInput') messageInput: MessageInput) {
    // const newComment = this.commentsService.addComment({ id: postId, comment });
    // pubSub.publish('commentAdded', { commentAdded: newComment });
    // return newComment;

    const message = {
      content: messageInput.content,
    };
    pubSub.publish('newMessage', message);
    return message;
  }
}
