import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './userTypes.js';

export const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: UUIDType },
        authorId: {type: UUIDType },
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

export const CreatePostInput = new GraphQLInputObjectType({
    name: "CreatePostInput",
    fields: {
      title: { type: GraphQLString, defaultValue: '' },
      content: { type: GraphQLString, defaultValue: '' },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
  })

  export const ChangePostInput = new GraphQLInputObjectType({
    name: "ChangePostInput",
    fields: {
      title: { type: GraphQLString, defaultValue: '' },
    },
  })