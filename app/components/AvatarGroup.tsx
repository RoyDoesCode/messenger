import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface AvatarGroupProps {
    users?: User[];
}

export default function AvatarGroup({ users = [] }: AvatarGroupProps) {
    const slicedUsers = users.slice(0, 3);

    const positionMap = {
        0: "top-0 left-[12px]",
        1: "bottom-0",
        2: "bottom-0 right-0",
    };

    return (
        <div className="relative h-11 w-11">
            {slicedUsers.map((user, index) => (
                <div
                    key={user.id}
                    className={`
                        absolute 
                        inline-block 
                        h-6
                        w-6
                        overflow-hidden
                        rounded-full
                        ${positionMap[index as keyof typeof positionMap]}`}
                >
                    <Image
                        alt="Avatar"
                        src={user?.image ?? "/images/placeholder.jpg"}
                        sizes="100%"
                        fill
                    />
                </div>
            ))}
        </div>
    );
}
