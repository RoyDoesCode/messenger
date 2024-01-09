import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { ErrorType } from "@/app/types/errors";
import { CONVERSATION_NEW_EVENT } from "@/app/types/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const { userId, isGroup, members, name } = body;

        if (!currentUser?.id || !currentUser.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (isGroup) {
            if (!members || members.length < 2 || !name) {
                return new NextResponse("Invalid data", { status: 400 });
            }

            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value,
                            })),
                            {
                                id: currentUser.id,
                            },
                        ],
                    },
                },
                include: {
                    users: true,
                },
            });

            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(
                        user.email,
                        CONVERSATION_NEW_EVENT,
                        newConversation
                    );
                }
            });

            return NextResponse.json(newConversation);
        }

        const existingConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId],
                        },
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id],
                        },
                    },
                ],
            },
        });

        if (existingConversation) {
            return NextResponse.json(existingConversation);
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: currentUser.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });

        newConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(
                    user.email,
                    CONVERSATION_NEW_EVENT,
                    newConversation
                );
            }
        });

        return NextResponse.json(newConversation);
    } catch (error) {
        console.log(error, ErrorType.CONVERSATION);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
