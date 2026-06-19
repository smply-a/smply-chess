import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="sticky top-0 w-full flex items-center justify-between py-6 px-6">
            <Link href="/">Simply Chess</Link>
            <ul className="flex gap-10">
                <Link href="/about">About</Link>
                <Link href="/account">Account</Link>
            </ul>
        </nav>
    )
}

export default Navbar