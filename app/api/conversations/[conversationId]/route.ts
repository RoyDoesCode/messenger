import getCurrentUser from "@/app/actions/getCurrentUser";
import { ErrorType } from "@/app/types/errors";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { CONVERSATION_DELETE_EVENT } from "@/app/types/pusher";

interface IParams {
    conversationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                users: true,
            },
        });

        if (!existingConversation) {
            return new NextResponse("Invalid Id", { status: 400 });
        }

        const deletedConversation = await prisma.conversation.delete({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id],
                },
            },
        });

        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(
                    user.email,
                    CONVERSATION_DELETE_EVENT,
                    deletedConversation
                );
            }
        });

        return NextResponse.json(deletedConversation);
    } catch (error) {
        console.log(error, ErrorType.CONVERSATION);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
