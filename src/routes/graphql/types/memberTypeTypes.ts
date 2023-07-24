import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { ProfileType } from './profileTypes.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypeIdEnum = new GraphQLEnumType({
    name: 'MemberTypeId',
    values: {
      basic: { value: MemberTypeId.BASIC },
      business: { value: MemberTypeId.BUSINESS },
    },
  });

export const MemberTypesType = new GraphQLObjectType({
    name: 'MembersType',
    fields: () => ({
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
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