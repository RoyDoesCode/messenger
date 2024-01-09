"use client";

import useConversation from "@/app/hooks/useConversation";
import { PopulatedConversation } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import React, { useEffect, useMemo, useState } from "react";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import {
    CONVERSATION_DELETE_EVENT,
    CONVERSATION_NEW_EVENT,
    CONVERSATION_UPDATE_EVENT,
} from "@/app/types/pusher";

interface ConversationListProps {
    otherUsers: User[];
    initialItems: PopulatedConversation[];
}

export default function ConversationList({
    otherUsers,
    initialItems,
}: ConversationListProps) {
    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const session = useSession();
    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const newConversationHandler = (
            conversation: PopulatedConversation
        ) => {
            setItems((currentItems) => {
                if (find(currentItems, { id: conversation.id })) {
                    return currentItems;
                }

                return [conversation, ...currentItems];
            });
        };

        const updateConversationHandler = (
            conversation: PopulatedConversation
        ) => {
            setItems((currentItems) =>
                currentItems.map((currentItem) => {
                    if (currentItem.id === conversation.id) {
                        return {
                            ...currentItem,
                            messages: conversation.messages,
                        };
                    }

                    return currentItem;
                })
            );
        };

        const deleteConversationHandler = (
            conversation: PopulatedConversation
        ) => {
            setItems((currentItems) => [
                ...currentItems.filter((item) => item.id !== conversation.id),
            ]);

            if (conversationId === conversation.id) {
                router.push("/conversations");
            }
        };

        pusherClient.bind(CONVERSATION_NEW_EVENT, newConversationHandler);
        pusherClient.bind(CONVERSATION_UPDATE_EVENT, updateConversationHandler);
        pusherClient.bind(CONVERSATION_DELETE_EVENT, deleteConversationHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind(CONVERSATION_NEW_EVENT, newConversationHandler);
            pusherClient.unbind(
                CONVERSATION_UPDATE_EVENT,
                updateConversationHandler
            );
            pusherClient.unbind(
                CONVERSATION_DELETE_EVENT,
                deleteConversationHandler
            );
        };
    }, [pusherKey, conversationId, router]);

    return (
        <>
            <GroupChatModal
                otherUsers={otherUsers}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside
                className={clsx(
                    `
                    fixed
                    inset-y-0
                    mb-20
                    overflow-y-auto
                    border-r
                    border-gray-200
                    lg:left-20
                    lg:mb-0
                    lg:block
                    lg:w-80`,
                    isOpen ? "hidden" : "left-0 block w-full"
                )}
            >
                <div className="px-5">
                    <div className="mb-4 flex justify-between pt-4">
                        <div className="text-2xl font-bold text-neutral-800">
                            Messages
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="
                                cursor-pointer 
                                rounded-full 
                                bg-gray-100 
                                p-2 
                                text-gray-600 
                                transition 
                                hover:opacity-75"
                        >
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {items.map((item) => (
                        <ConversationBox
                            key={item.id}
                            conversation={item}
                            selected={conversationId === item.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}
