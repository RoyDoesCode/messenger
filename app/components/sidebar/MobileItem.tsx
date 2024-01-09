import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface MobileItemProps {
    label: string;
    href: string;
    icon: IconType;
    active?: boolean;
    onClick?: () => void;
}

export default function MobileItem({
    label,
    href,
    icon: Icon,
    active,
    onClick,
}: MobileItemProps) {
    const handleClick = () => {
        return onClick?.();
    };

    return (
        <Link
            onClick={onClick}
            href={href}
            className={clsx(
                `
                group
                flex
                w-full
                justify-center
                gap-x-3
                p-4
                text-sm
                font-semibold
                leading-6
                text-gray-500
                hover:bg-gray-100
                hover:text-black`,
                active && "bg-gray-100 text-black"
            )}
        >
            <Icon className="h-6 w-6" />
        </Link>
    );
}
