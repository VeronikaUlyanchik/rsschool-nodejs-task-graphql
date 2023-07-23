import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, buildSchema, graphql, GraphQLArgs } from 'graphql';
import { Query } from './types/schema.js';

// var schema = buildSchema(`
//   type memberTypes {
//     id
//     discount
//     postsLimitPerMonth
// }
// type posts {
//     id
//     title
//     content
// }
// type users {
//     id
//     name
//     balance
// }
// type profiles {
//     id
//     isMale
//     yearOfBirth
// }
// `)


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
      })

      const { variables, query } = req.body;

     const res = graphql({schema: schema , source: query, variableValues: variables, contextValue: fastify })

          return res
    },
  });
};

export default plugin;
