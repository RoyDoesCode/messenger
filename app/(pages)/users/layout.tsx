import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import getOtherUsers from "@/app/actions/getOtherUsers";
import UserList from "./components/UserList";

interface UsersLayoutProps {
    children: React.ReactNode;
}

export default async function UsersLayout({ children }: UsersLayoutProps) {
    const otherUsers = await getOtherUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <UserList users={otherUsers} />
                {children}
            </div>
        </Sidebar>
    );
}
