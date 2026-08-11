import ChessBoard from "@/components/chess/ChessBoard";
import { ChessProvider } from "@/components/chess/ChessProvider";
import PlayerCard from "@/components/Match/PlayerCard";
import { PreferencesProvider } from "@/components/Match/PreferencesProvider";
// import { MatchProvider } from "@/lib/Chess/ChessProvider";

export default function LocalMatch() {
    const history = undefined
    const matchTime = 1000
    const mode = "locale"

    return (
        <ChessProvider history={history}>
            <PreferencesProvider>
                
                <div className="grid grid-cols-[1fr_2fr_1fr]">
                    <aside className="bg-red-600">Playing options / chat</aside>
            
                    <main className="">
                        <PlayerCard id={1} name={"joe"} pfp={""}/>

                        <ChessBoard/>

                        <PlayerCard id={1} name={"joe"} pfp={null} bottom/>
                    </main>
                
                    <aside className="bg-red-300">Movelist</aside>
                </div>
                
            </PreferencesProvider>
        </ChessProvider>
    );
}