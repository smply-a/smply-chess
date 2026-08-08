import ChessBoard from "@/components/chess/Chessboard";
import PlayerInfo from "@/components/Match/PlayerInfo";
import { MatchProvider } from "@/lib/Chess/ChessProvider";

export default function LocalMatch() {
    return (
        <MatchProvider>
            <div className="grid grid-cols-[1fr_2fr_1fr]">
                <aside className="bg-red-600">Playing options / chat</aside>
                <main className="">
                    <PlayerInfo id={1} name={"joe"} pfp={""} time={1}></PlayerInfo>
                    <ChessBoard/>
                    <PlayerInfo id={1} name={"joe"} pfp={null} time={1}></PlayerInfo>
                </main>
                <aside className="bg-red-300">Movelist</aside>
            </div>
        </MatchProvider>
    );
}