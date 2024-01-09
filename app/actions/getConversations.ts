import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import { ErrorType } from "../types/errors";
import { PopulatedConversation } from "../types";

export default async function getConversations() {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
        const conversations: PopulatedConversation[] =
            await prisma.conversation.findMany({
                orderBy: {
                    lastMessageAt: "desc",
                },
                where: {
                    userIds: {
                        has: currentUser.id,
                    },
                },
                include: {
                    users: true,
                    messages: {
                        include: {
                            sender: true,
                            seen: true,
                        },
                    },
                },
            });

        return conversations;
    } catch (error) {
        console.log(error, ErrorType.CONVERSATION);
        return [];
    }
}
