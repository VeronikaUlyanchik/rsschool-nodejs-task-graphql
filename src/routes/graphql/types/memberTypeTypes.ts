import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './userTypes.js';
import { FastifyInstance } from "fastify";
import { ProfileType } from './profileTypes.js';

export const MemberTypesType = new GraphQLObjectType({
    name: 'MembersType',
    fields: () => ({
        id: { type: UUIDType },
        discount: { type: GraphQLFloat },
        postsLimitPerMonth: { type: GraphQLInt },
        profiles: {
            type: new GraphQLList(ProfileType),
            async resolve(parents, args, context) {
                return await context.prisma.profile.findFirst({
                    where: {
                       id: parents.id
                    }
                })
            }
        },
    })
})