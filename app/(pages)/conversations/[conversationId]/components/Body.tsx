"use client";

import useConversation from "@/app/hooks/useConversation";
import { PopulatedMessage } from "@/app/types";
import { pusherClient } from "@/app/libs/pusher";
import MessageBox from "./MessageBox";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { find } from "lodash";
import { MESSAGE_NEW_EVENT, MESSAGE_UPDATE_EVENT } from "@/app/types/pusher";

interface BodyProps {
    initialMessages: PopulatedMessage[];
}

export default function Body({ initialMessages }: BodyProps) {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        const messageHandler = (message: PopulatedMessage) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((currentMessages) => {
                if (find(currentMessages, { id: message.id })) {
                    return currentMessages;
                }

                return [...currentMessages, message];
            });

            bottomRef?.current?.scrollIntoView();
        };

        const updateMessageHandler = (newMessage: PopulatedMessage) => {
            setMessages((currentMessages) =>
                currentMessages.map((currentMessage) => {
                    if (currentMessage.id === newMessage.id) {
                        return newMessage;
                    }

                    return currentMessage;
                })
            );
        };

        pusherClient.bind(MESSAGE_NEW_EVENT, messageHandler);
        pusherClient.bind(MESSAGE_UPDATE_EVENT, updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind(MESSAGE_NEW_EVENT, messageHandler);
            pusherClient.unbind(MESSAGE_UPDATE_EVENT, updateMessageHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    key={message.id}
                    isLast={i === messages.length - 1}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    );
}
