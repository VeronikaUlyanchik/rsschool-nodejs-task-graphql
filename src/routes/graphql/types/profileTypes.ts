import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeIdEnum, MemberTypesType } from './memberTypeTypes.js';
import { UserType } from './userTypes.js';

export const ProfileType = new GraphQLObjectType({
    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDType) },
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: MemberTypeIdEnum },
        memberType: {
            type: MemberTypesType,
            async resolve(parents, args, context) {
                return await context.dataLoader.typeMembersByType.load(parents.memberTypeId);
            } 
        }, 
        userId: { type: new GraphQLNonNull(UUIDType) },
        user: {
            type: UserType,
            async resolve(parents, args, context) {
                return await context.prisma.user.findFirst({
                    where: {
                       id: parents.userId,
                    }
                })
            } 
        }
    })
})

export const CreateProfileInput = new GraphQLInputObjectType({
    name: "CreateProfileInput",
    fields: {
      isMale: { type: GraphQLBoolean },
      yearOfBirth: { type: GraphQLInt },
      memberTypeId: { type: MemberTypeIdEnum },
      userId: { type: new GraphQLNonNull(UUIDType) },
    },
  })

  export const ChangeProfileInput = new GraphQLInputObjectType({
    name: "ChangeProfileInput",
    fields: {
        isMale: { type: GraphQLBoolean },
    },
  })