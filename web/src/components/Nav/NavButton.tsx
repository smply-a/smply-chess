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
                before:content-[attr(data-text)] before:font-bold before:h-0 before:overflow-hidden before:invisible
            ${isActive 
            ? "bg-white text-black font-bold" 
            : "text-white hover:bg-white/10 font-normal"}
            `}
        >
            {children}
        </Link>
    );
};

export default NavButton