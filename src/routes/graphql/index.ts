import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLError, GraphQLSchema, graphql, parse, validate } from 'graphql';
import { Mutation, Query } from './types/schema.js';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';
import { dataLoader } from './loaders.js';

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
      });

    const { variables, query } = req.body;

    const validation = validate(schema, parse(query), [depthLimit(5)]);

    if(validation?.length) {
        return {
          errors: validation,
          data: null,
        };
    }

    const res = await graphql({schema: schema , source: query, variableValues: variables, contextValue: {
      prisma: fastify.prisma,
      dataLoader: dataLoader(fastify.prisma),
    }})

    return res
    },
  });
};

export default plugin;
