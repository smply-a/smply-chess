import ChessBoard from "@/components/chess/Chessboard";
import PlayerCard from "@/components/Match/PlayerCard";
import { ChessProvider } from "@/lib/Chess/ChessProvider";
import { InteractionProvider } from "@/lib/Chess/InteractionProvider";
// import { MatchProvider } from "@/lib/Chess/ChessProvider";

export default function LocalMatch() {
    return (
        <ChessProvider>
            <InteractionProvider>
                <div className="grid grid-cols-[1fr_2fr_1fr]">
                    <aside className="bg-red-600">Playing options / chat</aside>
                    <main className="">
                        <PlayerCard id={1} name={"joe"} pfp={""} time={1}></PlayerCard>
                        <ChessBoard/>
                        <PlayerCard id={1} name={"joe"} pfp={null} time={1}></PlayerCard>
                    </main>
                    <aside className="bg-red-300">Movelist</aside>
                </div>
            </InteractionProvider>
        </ChessProvider>
    );
}