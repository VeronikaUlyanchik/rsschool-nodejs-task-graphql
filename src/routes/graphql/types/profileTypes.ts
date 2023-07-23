import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { FastifyInstance } from 'fastify';
import { MemberTypesType } from './memberTypeTypes.js';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: UUIDType },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        MemberTypeId: { type: UUIDType },
        memberTypes: {
            type: MemberTypesType,
            async resolve(parents, args, context) {
                return await context.prisma.memberType.findFirst({
                    where: {
                       id: parents.memberTypeId,
                    }
                })
            }
            
        }
    })
})