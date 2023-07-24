import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UUIDType } from "./uuid.js";
import { ChangeUserInput, CreateUserInput, UserType } from "./userTypes.js";
import { ChangePostInput, CreatePostInput, PostType } from "./postsTypes.js";
import { ChangeProfileInput, CreateProfileInput, ProfileType } from "./profileTypes.js";
import { MemberTypeIdEnum, MemberTypesType } from "./memberTypeTypes.js";
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from "graphql-parse-resolve-info";

export const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            async resolve(parents, args, context, info){
            const resolved = parseResolveInfo(info) as any;
            const { fields } = simplifyParsedResolveInfoFragmentWithType(
               resolved,
                UserType,
            );
                
                const users =  await context.prisma.user.findMany({
                    include: {
                        userSubscribedTo: 'userSubscribedTo' in  fields,
                        subscribedToUser: 'subscribedToUser' in  fields,
                      },
                });
                users?.forEach(element => {
                    context.dataLoader.subscribedToUserUserIds.prime(element.id);
                    context.dataLoader.userSubscribedToByUserIds.prime(element.id);
                });
                return users;
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

export const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createPost: {
            type: PostType,
            args: {dto: { type: CreatePostInput }},
            async resolve(parents, args, context){
                return await context.prisma.post.create({
                    data: {
                        title: args.dto.title,
                        content: args.dto.content,
                        author: {connect: {id: args.dto.authorId }}
                    }
                });
            }
        },
        deletePost: {
            type: GraphQLBoolean,
            args: {id: { type:  new GraphQLNonNull(UUIDType) }},
            async resolve(parents, args, context){
                await context.prisma.post.delete({
                    where: {
                        id: args.id,
                    },
                });
            }
        },
        changePost: {
            type: PostType,
            args: {id: { type:  new GraphQLNonNull(UUIDType) }, dto: {type: ChangePostInput}},
            async resolve(parents, args, context){
                return await context.prisma.post.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        ...args.dto,
                    }
                });
            }
        },
        createUser: {
            type: UserType,
            args: {dto: { type: CreateUserInput }},
            async resolve(parents, args, context){
                return await context.prisma.user.create({
                    data: {
                        ...args.dto,
                    }
                });
            }
        },
        deleteUser: {
            type: GraphQLBoolean,
            args: {id: { type:  new GraphQLNonNull(UUIDType) }},
            async resolve(parents, args, context){
                await context.prisma.user.delete({
                    where: {
                        id: args.id,
                    },
                });
            }
        },
        changeUser: {
            type: UserType,
            args: {id: { type:  new GraphQLNonNull(UUIDType) }, dto: {type: ChangeUserInput}},
            async resolve(parents, args, context){
                return await context.prisma.user.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        ...args.dto,
                    }
                });
            }
        },
        createProfile: {
            type: ProfileType,
            args: {dto: { type: CreateProfileInput }},
            async resolve(parents, args, context){
                return await context.prisma.profile.create({
                    data: {
                        isMale: args.dto.isMale,
                        yearOfBirth: args.dto.yearOfBirth,
                        user: {connect: {id: args.dto.userId}},
                        memberType: {connect: {id: args.dto.memberTypeId}}
                    }
                });
            }
        },
        deleteProfile: {
            type: GraphQLBoolean,
            args: {id: { type:  new GraphQLNonNull(UUIDType) }},
            async resolve(parents, args, context){
                await context.prisma.profile.delete({
                    where: {
                        id: args.id,
                    },
                });
            }
        },
        changeProfile: {
            type: ProfileType,
            args: {id: { type:  new GraphQLNonNull(UUIDType) }, dto: {type: ChangeProfileInput}},
            async resolve(parents, args, context){
                return await context.prisma.profile.update({
                    where: {
                        id: args.id,
                    },
                    data: {
                        ...args.dto,
                    }
                });
            }
        },
        subscribeTo: {
            type: UserType,
            args: {userId: { type:  new GraphQLNonNull(UUIDType) }, authorId: {type: new GraphQLNonNull(UUIDType)}},
            async resolve(parents, args, context){
                return await context.prisma.subscribersOnAuthors.create({
                    data: {
                        subscriber: {connect: {id: args.userId}},
                        author: {connect: {id: args.authorId}},
                    }
                });
            }
        },
        unsubscribeFrom: {
            type: GraphQLBoolean,
            args: {userId: { type:  new GraphQLNonNull(UUIDType) }, authorId: {type: new GraphQLNonNull(UUIDType)}},
            async resolve(parents, args, context){
                await context.prisma.subscribersOnAuthors.delete({
                    where: {
                        subscriberId_authorId: {
                            authorId: args.authorId,
                            subscriberId: args.userId,
                        }
                    },
                });
            }
        },
    })
})