import ChessBoard from "@/components/chess/Chessboard";
import { MatchProvider } from "@/lib/Chess/ChessProvider";

export default function LocaleMatch() {
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