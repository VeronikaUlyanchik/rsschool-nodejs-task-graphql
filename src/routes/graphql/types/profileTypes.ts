import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypesType } from './memberTypeTypes.js';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        MemberTypeId: { type: UUIDType },
        memberType: {
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