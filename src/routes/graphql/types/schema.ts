import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { UserType } from "./userTypes.js";
import { PostType } from "./postsTypes.js";
import { ProfileType } from "./profileTypes.js";
import { MemberTypeIdEnum, MemberTypesType } from "./memberTypeTypes.js";

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            async resolve(parents, args, context){
                return await context.prisma.user.findMany();
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            async resolve(parents, args, context){
                return await context.prisma.post.findMany();
            }
        },
        profiles: {
            type: new GraphQLList(ProfileType),
            async resolve(parents, args, context){
                return await context.prisma.profile.findMany();
            }
        },
        memberTypes: {
            type: new GraphQLList(MemberTypesType),
            async resolve(parents, args, context){
                return await context.prisma.memberType.findMany();
            }
        },
        user: {
            type: UserType,
            args: { id: {type: UUIDType } },
            async resolve(parents, args, context){
                return await context.prisma.user.findFirst({
                    where: {
                        id: args.id
                    }
                });
            }
        },
        memberType: {
            type: MemberTypesType,
            args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum)} },
            async resolve(parents, args, context){
                return await context.prisma.memberType.findFirst({
                    where: {
                        id: args.id
                    }
                });
            }
        },
        post: {
            type: PostType,
            args: { id: {type: UUIDType } },
            async resolve(parents, args, context){
                return await context.prisma.post.findFirst({
                    where: {
                        id: args.id
                    }
                });
            }
        },
        profile: {
            type: ProfileType,
            args: { id: {type: UUIDType } },
            async resolve(parents, args, context){
                return await context.prisma.profile.findFirst({
                    where: {
                        id: args.id
                    }
                });
            }
        },
    })
})