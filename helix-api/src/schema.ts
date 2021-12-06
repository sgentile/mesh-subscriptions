import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";
import typeDefs from "./schema.graphql";
import { PubSubChannels } from "./pubsub";
import { Message, MessageInput } from "models";

const resolvers = {
  Query: {
    getMessages: () => [
      {
        content: "Test 1",
      },
    ],
    // feed: async (
    //   parent: unknown,
    //   args: {
    //     filter?: string;
    //     skip?: number;
    //     take?: number;
    //     orderBy?: {
    //       description?: Prisma.SortOrder;
    //       url?: Prisma.SortOrder;
    //       createdAt?: Prisma.SortOrder;
    //     };
    //   },
    //   context: GraphQLContext
    // ) => {
    //   const where = args.filter
    //     ? {
    //         OR: [
    //           { description: { contains: args.filter } },
    //           { url: { contains: args.filter } },
    //         ],
    //       }
    //     : {};

    //   const totalCount = await context.prisma.link.count({ where });
    //   const links = await context.prisma.link.findMany({
    //     where,
    //     skip: args.skip,
    //     take: args.take,
    //     orderBy: args.orderBy,
    //   });

    //   return {
    //     count: totalCount,
    //     links,
    //   };
    // },
    // me: (parent: unknown, args: {}, context: GraphQLContext) => {
    //   if (context.currentUser === null) {
    //     throw new Error("Unauthenticated!");
    //   }

    //   return context.currentUser;
    // },
  },
  //   User: {
  //     links: (parent: User, args: {}, context: GraphQLContext) =>
  //       context.prisma.user.findUnique({ where: { id: parent.id } }).links(),
  //   },
  //   Vote: {
  //     link: (parent: User, args: {}, context: GraphQLContext) =>
  //       context.prisma.vote.findUnique({ where: { id: parent.id } }).link(),
  //     user: (parent: User, args: {}, context: GraphQLContext) =>
  //       context.prisma.vote.findUnique({ where: { id: parent.id } }).user(),
  //   },
  //   Link: {
  //     id: (parent: Link) => parent.id,
  //     description: (parent: Link) => parent.description,
  //     url: (parent: Link) => parent.url,
  //     votes: (parent: Link, args: {}, context: GraphQLContext) =>
  //       context.prisma.link.findUnique({ where: { id: parent.id } }).votes(),
  //     postedBy: async (parent: Link, args: {}, context: GraphQLContext) => {
  //       if (!parent.postedById) {
  //         return null;
  //       }

  //       return context.prisma.link
  //         .findUnique({ where: { id: parent.id } })
  //         .postedBy();
  //     },
  //   },
  Mutation: {
    createNewMessage: (
      parent: unknown,
      args: { messageInput: MessageInput },
      context: GraphQLContext
    ) => {
      const message = {
        content: args.messageInput.content,
      } as Message;
      context.pubSub.publish("newMessage", message);
      return message;
    },
  },
  //   Mutation: {
  //     post: async (
  //       parent: unknown,
  //       args: { description: string; url: string },
  //       context: GraphQLContext
  //     ) => {
  //       if (context.currentUser === null) {
  //         throw new Error("Unauthenticated!");
  //       }

  //       const newLink = await context.prisma.link.create({
  //         data: {
  //           url: args.url,
  //           description: args.description,
  //           postedBy: { connect: { id: context.currentUser.id } },
  //         },
  //       });

  //       context.pubSub.publish("newLink", { createdLink: newLink });

  //       return newLink;
  //     },
  //     signup: async (
  //       parent: unknown,
  //       args: { email: string; password: string; name: string },
  //       context: GraphQLContext
  //     ) => {
  //       const password = await hash(args.password, 10);

  //       const user = await context.prisma.user.create({
  //         data: { ...args, password },
  //       });

  //       const token = sign({ userId: user.id }, APP_SECRET);

  //       return {
  //         token,
  //         user,
  //       };
  //     },
  //     login: async (
  //       parent: unknown,
  //       args: { email: string; password: string },
  //       context: GraphQLContext
  //     ) => {
  //       const user = await context.prisma.user.findUnique({
  //         where: { email: args.email },
  //       });
  //       if (!user) {
  //         throw new Error("No such user found");
  //       }

  //       const valid = await compare(args.password, user.password);
  //       if (!valid) {
  //         throw new Error("Invalid password");
  //       }

  //       const token = sign({ userId: user.id }, APP_SECRET);

  //       return {
  //         token,
  //         user,
  //       };
  //     },
  //     vote: async (
  //       parent: unknown,
  //       args: { linkId: string },
  //       context: GraphQLContext
  //     ) => {
  //       // 1
  //       if (!context.currentUser) {
  //         throw new Error("You must login in order to use upvote!");
  //       }

  //       // 2
  //       const userId = context.currentUser.id;

  //       // 3
  //       const vote = await context.prisma.vote.findUnique({
  //         where: {
  //           linkId_userId: {
  //             linkId: Number(args.linkId),
  //             userId: userId,
  //           },
  //         },
  //       });

  //       if (vote !== null) {
  //         throw new Error(`Already voted for link: ${args.linkId}`);
  //       }

  //       // 4
  //       const newVote = await context.prisma.vote.create({
  //         data: {
  //           user: { connect: { id: userId } },
  //           link: { connect: { id: Number(args.linkId) } },
  //         },
  //       });

  //       context.pubSub.publish("newVote", { createdVote: newVote });

  //       return newVote;
  //     },
  //   },
  Subscription: {
    newMessage: {
      subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
        return context.pubSub.asyncIterator("newMessage");
      },
      resolve: (payload: PubSubChannels["newMessage"][0]) => {
        return { content: payload.content };
      },
    },
  },
  //   Subscription: {
  //     newLink: {
  //       subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
  //         return context.pubSub.asyncIterator("newLink");
  //       },
  //       resolve: (payload: PubSubChannels["newLink"][0]) => {
  //         return payload.createdLink;
  //       },
  //     },
  //     newVote: {
  //       subscribe: (parent: unknown, args: {}, context: GraphQLContext) => {
  //         return context.pubSub.asyncIterator("newVote");
  //       },
  //       resolve: (payload: PubSubChannels["newVote"][0]) => {
  //         return payload.createdVote;
  //       },
  //     },
  //   },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
