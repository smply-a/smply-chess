import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
    return (
        <article className="flex flex-col items-center flex-1 pt-[15vh] gap-10">
            <h1 className="font-bold text-white text-2xl">Smply Chess</h1>

            <ul className="flex items-center justify-center gap-6">
                <Link href="/play">
                    <Button variant="primary" size="md" className="">Challenge Bot</Button>
                </Link>
                <Link href="/play">
                    <Button variant="secondary" size="md" className="">Create Lobby</Button>
                </Link>
                <Link href="/play">
                    <Button variant="secondary" size="md">Play local</Button>
                </Link>
            </ul>

            <section className="text-text-secondary px-4">
                <p>
                    Chess became a big hobby of mine at the start of my computer science studies. To get going with my
                    coding skills i wanted to make a meaningful fullstack app that I actually care about. So i wanted to make
                    a strong chess engine that you can play on th web and also create a space for multiplayer matches to learn
                    networking and statemanagement on the backend etc.
                </p>

            </section>
        </article>
    );
}