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
            resolve(parents, args, context) {
                return context.prisma.post.findMany({
                    where: {
                        authorId: parents.id,
                    }
                })
            }
        },
        profile: {
            type: ProfileType,
            resolve(parents, args, context) {
                return context.prisma.profile.findFirst({
                    where: {
                        userId: parents.id,
                    }
                })
            }
        },
        userSubscribedTo:{
            type: new GraphQLList(UserType),
            resolve(parents, args, context) {
                return context.prisma.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                              subscriberId: parents.id,
                            },
                          },
                    }
                })
            }
        },
        subscribedToUser:{
            type: new GraphQLList(UserType),
            resolve(parents, args, context) {
                return context.prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                              authorId: parents.id,
                            },
                          },
                    }
                })
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