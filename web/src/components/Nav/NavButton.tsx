"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface Props {
    href: string
    children: React.ReactNode
}

const NavButton = ({ href, children }: Props) => {
    const isActive = usePathname() === href;

    return (
        <Link
            href={href}
            data-text={children}
            className={`
                inline-flex flex-col items-center justify-center px-4 py-1 text-sm rounded-xl transition-colors
            ${isActive 
            ? "bg-nav-bg-active text-nav-text-active" 
            : "bg-nav-bg text-nav-text hover:bg-nav-hover hover:text-nav-text-hover"}
            `}
        >
            {children}
        </Link>
    );
};

export default NavButton