"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import React from "react";
import MobileItem from "./MobileItem";

export default function MobileFooter() {
    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) {
        return null;
    }

    return (
        <div
            className="
            fixed 
            bottom-0 
            flex 
            w-full
            items-center 
            justify-between 
            border-t-[1px] 
            bg-white
            lg:hidden"
        >
            {routes.map((item) => (
                <MobileItem key={item.label} {...item} />
            ))}
        </div>
    );
}
