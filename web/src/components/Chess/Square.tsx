import { pieceMapping } from "@/lib/Chess/board";
import { Move } from "@/lib/Chess/movegen";
import { Piece } from "@/lib/Chess/types";
import Image from "next/image";

interface Props {
    piece: Piece | null;
    isWhite: boolean;
    isSelected: boolean;
    possibleMove?: Move[];
    onClick: () => void;
}

const ChessSquare = ({ piece, isWhite, isSelected, possibleMove, onClick }: Props) => {
    const color = isSelected ? "bg-gray-400" : isWhite ? "bg-white" : "bg-black";
    const textColor = isWhite ? "text-black" : "text-white";
    
    const isMove = possibleMove && possibleMove.length > 0
    const isCapture = isMove && possibleMove[0].type === "capture"

    const cursor = piece || isMove ? "cursor-pointer" : "";

    return (
        <div
            // relative als anker für zugindikator
            className={`relative flex justify-center items-center aspect-square ${color} ${textColor} ${cursor}`}
            onClick={onClick}
        >
            <div className={"relative w-full h-full z-10 p-[5%]"}>
                {piece && <Image 
                    src={pieceMapping[piece]} 
                    alt={piece} 
                    fill
                    unoptimized
                    priority
                />}
            </div>

            {isMove && (
                <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
                    {isCapture ? (
                        <div className="w-11/12 h-11/12 border-4 border-red-300 rounded-full" />
                    ) : (
                        <div className="w-1/4 h-1/4 bg-red-300 rounded-full" />
                    )}
                </div>
            )}
        </div>
    );
};

ChessSquare.displayName = "ChessSquare";

export default ChessSquare;