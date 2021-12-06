import { FastifyRequest } from "fastify";
import { pubSub } from "./pubsub";

export type GraphQLContext = {
  pubSub: typeof pubSub;
};

export async function contextFactory(
  request: FastifyRequest
): Promise<GraphQLContext> {
  return {
    pubSub,
  };
}
