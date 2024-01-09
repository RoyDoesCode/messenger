import prisma from "@/app/libs/prismadb";
import { ErrorType } from "../types/errors";
import { PopulatedMessage } from "../types";

export default async function getMessages(conversationId: string) {
    try {
        const messages: PopulatedMessage[] = await prisma.message.findMany({
            where: {
                conversationId,
            },
            include: {
                sender: true,
                seen: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages;
    } catch (error) {
        console.log(error, ErrorType.MESSAGE);
        return [];
    }
}
