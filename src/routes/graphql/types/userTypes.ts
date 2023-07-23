import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { FastifyInstance } from 'fastify';
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
                return context.prisma.profile.findMany({
                    where: {
                        userId: parents.id,
                    }
                })
            }
        },

    })
})