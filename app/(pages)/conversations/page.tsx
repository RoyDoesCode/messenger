"use client";

import React from "react";
import useConversation from "@/app/hooks/useConversation";
import EmptyState from "@/app/components/EmptyState";
import clsx from "clsx";

export default function Home() {
    const { isOpen } = useConversation();

    return (
        <div
            className={clsx(
                "h-full lg:block lg:pl-80",
                isOpen ? "block" : "hidden"
            )}
        >
            <EmptyState />
        </div>
    );
}
