import { GraphQLFloat, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { FastifyInstance } from 'fastify';

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
    })
})

export const Query = async (fastify: FastifyInstance) => new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: {
            type: UserType,
            args: { id: { type: UUIDType }},
            async resolve(parents, args){
                return await fastify.prisma.user.findMany();
            }
        }
    })
})