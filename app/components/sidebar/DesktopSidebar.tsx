"use client";

import useRoutes from "@/app/hooks/useRoutes";
import React, { useState } from "react";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
    currentUser: User | null;
}

export default function DesktopSidebar({ currentUser }: DesktopSidebarProps) {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <SettingsModal
                currentUser={currentUser!}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <div
                className="
                hidden 
                justify-between
                lg:fixed
                lg:inset-y-0
                lg:left-0
                lg:z-40
                lg:flex
                lg:w-20
                lg:flex-col
                lg:overflow-y-auto
                lg:border-r-[1px]
                lg:bg-white
                lg:pb-4
                xl:px-6"
            >
                <nav className="mt-4 flex flex-col justify-between">
                    <ul
                        role="list"
                        className="flex flex-col items-center space-y-1"
                    >
                        {routes.map((item) => (
                            <DesktopItem key={item.label} {...item} />
                        ))}
                    </ul>
                </nav>
                <nav className="mt-4 flex flex-col items-center justify-between">
                    <div
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer transition hover:opacity-75"
                    >
                        <Avatar user={currentUser} />
                    </div>
                </nav>
            </div>
        </>
    );
}
