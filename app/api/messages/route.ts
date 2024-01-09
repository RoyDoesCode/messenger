import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { ErrorType } from "@/app/types/errors";
import {
    CONVERSATION_UPDATE_EVENT,
    MESSAGE_NEW_EVENT,
} from "@/app/types/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { message, image, conversationId } = body as {
            message: string;
            image?: string;
            conversationId: string;
        };

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: currentUser.id,
                    },
                },
                seen: {
                    connect: {
                        id: currentUser.id,
                    },
                },
            },
            include: {
                sender: true,
                seen: true,
            },
        });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id,
                    },
                },
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        await pusherServer.trigger(
            conversationId,
            MESSAGE_NEW_EVENT,
            newMessage
        );

        const lastMessage = updatedConversation.messages.at(-1);

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, CONVERSATION_UPDATE_EVENT, {
                id: conversationId,
                messages: [lastMessage],
            });
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.log(error, ErrorType.MESSAGE);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
