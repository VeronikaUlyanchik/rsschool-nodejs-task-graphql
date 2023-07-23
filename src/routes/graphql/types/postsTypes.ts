import { GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './userTypes.js';

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: UUIDType },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: {
            type: UserType,
            async resolve(parents, args, context) {
                return await context.prisma.user.findFirst({
                    where: {
                       id: parents.authorId,
                    }
                })
            }
        },
    })
})