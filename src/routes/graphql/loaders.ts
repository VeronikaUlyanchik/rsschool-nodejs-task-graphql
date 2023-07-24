import { MemberType, Post, PrismaClient, Profile, User } from "@prisma/client";
import DataLoader from "dataloader";

const getPostByAuthorId = (prisma: PrismaClient) => {
   return new DataLoader<string, Post[]>(async (ids) => {
        const posts = await prisma.post.findMany({
            where: {
                authorId: { in: ids as string[] }
            }, 
        })
        return ids.map((id) => posts.filter((data) => data.authorId === id));
    })
}

const getTypeMembersByType = (prisma: PrismaClient) => {
    return new DataLoader<string, MemberType | null>(async (ids) => {
         const membersType = await prisma.memberType.findMany({
             where: {
                 id: { in: ids as string[] }
             }, 
         })
         return ids.map((id) => membersType.find((data) => data.id === id) || null);
     })
 }

 const getProfileByUserId = (prisma: PrismaClient) => {
    return new DataLoader<string, Profile | null>(async (ids) => {
         const profiles = await prisma.profile.findMany({
             where: {
                userId: { in: ids as string[] }
             }, 
         })
         return ids.map((id) => profiles.find((data) => data.userId === id) || null);
     })
 }


 const getUserSubscribedToByUserIds = (prisma: PrismaClient) => {
    return new DataLoader<string, User[]>(async (ids) => {
         const users = await prisma.user.findMany({
            where: {
                subscribedToUser: {
                    some: {
                      subscriberId: {in : ids as string[] },
                    },
                },
            }, 
            include: {
                subscribedToUser: true,
            }
        })
         return ids.map((id) => users.filter((data) => data.subscribedToUser.some((data2)=> data2.subscriberId === id)));
     })
 }

 const getSubscribedToUserUserIds = (prisma: PrismaClient) => {
    return new DataLoader<string, User[]>(async (ids) => {
         const users = await prisma.user.findMany({
            where: {
                userSubscribedTo: {
                    some: {
                      authorId: { in : ids as string[] },
                    },
                  },
            },
            include: {
                userSubscribedTo: true,
            }
        })
         return ids.map((id) => users.filter((data) => data.userSubscribedTo.some((data2)=> data2.authorId === id)));
     })
 }

export const dataLoader = (prisma: PrismaClient) => ({
    postsByAuthorId: getPostByAuthorId(prisma),
    typeMembersByType: getTypeMembersByType(prisma),
    profileByUserId: getProfileByUserId(prisma),
    subscribedToUserUserIds: getSubscribedToUserUserIds(prisma),
    userSubscribedToByUserIds: getUserSubscribedToByUserIds(prisma),
})