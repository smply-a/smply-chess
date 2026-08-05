import Link from "next/link"

const Footer = () => {
    return (
        <footer className="text-sm flex items-center justify-center py-4 border-t border-border-default">
            <Link 
                className=""
                href={""}
                // todo add link to homepage
            >
                a smply project
            </Link>
        </footer>
    )
}

export default Footer