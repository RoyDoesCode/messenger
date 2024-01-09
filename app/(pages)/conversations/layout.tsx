import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getConversations from "@/app/actions/getConversations";
import getOtherUsers from "@/app/actions/getOtherUsers";

interface CoversationsLayoutProps {
    children: React.ReactNode;
}

export default async function CoversationsLayout({
    children,
}: CoversationsLayoutProps) {
    const conversations = await getConversations();
    const otherUsers = await getOtherUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList
                    otherUsers={otherUsers}
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    );
}
