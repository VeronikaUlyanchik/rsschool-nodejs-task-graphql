import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { Mutation, Query } from './types/schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const schema = new GraphQLSchema({
        query: Query,
        mutation: Mutation,
      })

    const { variables, query } = req.body;

     const res = await graphql({schema: schema , source: query, variableValues: variables, contextValue: fastify })

    return res
    },
  });
};

export default plugin;
