import ChessBoard from "@/components/Chessboard";

export default function Home() {
    return (
        <div className="flex">
            <aside>Playing options / chat</aside>
            <ChessBoard/>
        </div>
    );
}

