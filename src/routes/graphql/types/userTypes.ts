import { GraphQLFloat, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './postsTypes.js';
import { ProfileType } from './profileTypes.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: UUIDType },
        name: { type: GraphQLString },
        balance: { type: GraphQLFloat },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parents, args, context) {
                return await context.dataLoader.postsByAuthorId.load(parents.id);
            }
        },
        profile: {
            type: ProfileType,
            async resolve(parents, args, context) {
                return await context.dataLoader.profileByUserId.load(parents.id);
            }
        },
        userSubscribedTo:{
            type: new GraphQLList(UserType),
            async resolve(parents, args, context) {
                return await context.dataLoader.userSubscribedToByUserIds.load(parents.id);
            }
        },
        subscribedToUser:{
            type: new GraphQLList(UserType),
            async resolve(parents, args, context) {
                return await context.dataLoader.subscribedToUserUserIds.load(parents.id);
            }
        }

    })
})

export const CreateUserInput = new GraphQLInputObjectType({
    name: "CreateUserInput",
    fields: {
      name: { type: GraphQLString, defaultValue: '' },
      balance: { type: GraphQLFloat, defaultValue: 0 },
    },
  })

  export const ChangeUserInput = new GraphQLInputObjectType({
    name: "ChangeUserInput",
    fields: {
        name: { type: GraphQLString },
    },
  })