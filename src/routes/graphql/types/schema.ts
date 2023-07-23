import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import { UserType } from "./userTypes.js";
import { PostType } from "./postsTypes.js";
import { ProfileType } from "./profileTypes.js";
import { MemberTypesType } from "./memberTypeTypes.js";

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: UserType,
            async resolve(parents, args, context){
                return await context.prisma.user.findMany();
            }
        },
        posts: {
            type: PostType,
            async resolve(parents, args, context){
                return await context.prisma.post.findMany();
            }
        },
        profiles: {
            type: ProfileType,
            async resolve(parents, args, context){
                return await context.prisma.profile.findMany();
            }
        },
        memberTypes: {
            type: MemberTypesType,
            async resolve(parents, args, context){
                return await context.prisma.memberType.findMany();
            }
        }
    })
})