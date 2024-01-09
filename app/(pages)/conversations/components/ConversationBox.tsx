"use client";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUser";
import { PopulatedConversation } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

interface ConversationBoxProps {
    conversation: PopulatedConversation;
    selected?: boolean;
}

export default function ConversationBox({
    conversation,
    selected,
}: ConversationBoxProps) {
    const otherUser = useOtherUser(conversation);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${conversation.id}`);
    }, [conversation.id, router]);

    const lastMessage = useMemo(() => {
        const messages = conversation.messages ?? [];

        return messages.at(-1);
    }, [conversation.messages]);

    const userEmail = useMemo(() => {
        return session?.data?.user?.email;
    }, [session?.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage || !userEmail) {
            return false;
        }

        const seenArray = lastMessage.seen ?? [];

        return seenArray.findIndex((user) => user.email === userEmail) !== -1;
    }, [lastMessage, userEmail]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return "Sent an image";
        }

        return lastMessage?.body ?? "Started a conversation";
    }, [lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={clsx(
                `
                relative
                flex
                w-full
                cursor-pointer
                items-center
                space-x-3
                rounded-lg
                p-3
                transition
                hover:bg-neutral-100`,
                selected ? "bg-neutral-100" : "bg-white"
            )}
        >
            {conversation.isGroup ? (
                <AvatarGroup users={conversation.users} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="mb-1 flex items-center justify-between">
                        <p className="text-md font-medium text-gray-900">
                            {conversation.name ?? otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="text-xs font-light text-gray-400">
                                {format(new Date(lastMessage.createdAt), "p")}
                            </p>
                        )}
                    </div>
                    <p
                        className={clsx(
                            `
                            truncate
                            text-sm`,
                            hasSeen ? "text-gray-500" : "font-medium text-black"
                        )}
                    >
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );
}
