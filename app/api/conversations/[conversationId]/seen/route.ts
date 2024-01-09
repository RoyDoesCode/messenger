import getCurrentUser from "@/app/actions/getCurrentUser";
import { ErrorType } from "@/app/types/errors";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import {
    CONVERSATION_UPDATE_EVENT,
    MESSAGE_UPDATE_EVENT,
} from "@/app/types/pusher";

interface IParams {
    conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
    try {
        const currentUser = await getCurrentUser();
        const { conversationId } = params;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Find current conversation
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse("Invalid Id", { status: 400 });
        }

        // Find the last message
        const lastMessage = conversation.messages.at(-1);

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        // Update seen of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
        });

        await pusherServer.trigger(
            currentUser.email,
            CONVERSATION_UPDATE_EVENT,
            {
                id: conversationId,
                messages: [updatedMessage],
            }
        );

        if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(
            conversationId!,
            MESSAGE_UPDATE_EVENT,
            updatedMessage
        );

        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.log(error, ErrorType.MESSAGE);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
