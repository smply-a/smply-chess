import ChessBoard from "@/components/Chess/Chessboard";
import { MatchProvider } from "@/lib/Chess/ChessProvider";

export default function Home() {
    return (
        <MatchProvider>
            <div className="grid grid-cols-[1fr_2fr_1fr]">
                <aside className="bg-red-600">Playing options / chat</aside>
                <main className=""><ChessBoard/></main>
                <aside className="bg-red-300">Movelist</aside>
            </div>
        </MatchProvider>
    );
}

//todo: chess provider für zustand und

