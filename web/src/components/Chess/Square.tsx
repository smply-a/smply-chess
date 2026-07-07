import { Move } from "@/lib/Chess/movegen";
import { Color, getColor, Piece } from "@/lib/Chess/types";
import PieceComponent from "./Piece";

interface Props {
    piece: Piece | null;
    turn: Color;
    isWhite: boolean;
    isSelected: boolean;
    isLastMove: boolean
    isCheck: boolean;
    possibleMove?: Move[];
    onClick: () => void;
}

const ChessSquare = ({ isCheck, piece, isWhite, isSelected, isLastMove, possibleMove, onClick, turn }: Props) => {
    let squareColor = isWhite ? "bg-board-light" : "bg-board-dark";
    if (isLastMove) squareColor = "bg-square-last-move"
    if (isSelected) squareColor = "bg-square-selected"

    const isMove = possibleMove && possibleMove.length > 0
    const isCapture = isMove && possibleMove[0].type === "capture"

    const cursor = (piece && getColor(piece) === turn) || isMove ? "cursor-pointer" : "";
    const hover = isMove ? "hover:bg-square-hover" : ""

    return (
        <div
            // relative als anker für zugindikator
            className={`
                relative flex justify-center items-center aspect-square 
                ${squareColor} ${cursor} ${hover} transition-colors duration-75
                `}
            onMouseDown={(e) => {
                e.preventDefault();
                onClick()
            }}
        >

            <div className={"relative w-full h-full z-10 p-[5%]"}>
                {piece && <PieceComponent piece={piece}/>}
            </div>

            {isCheck && !isSelected && (
                <div className="absolute inset-0 bg-square-check" />
            )}

            {isMove && (
                <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none">
                    {isCapture ? (
                        <div className="border-move-indicator w-11/12 h-11/12 border-4 rounded-full" />
                    ) : (
                        <div className="bg-move-indicator w-1/4 h-1/4 rounded-full" />
                    )}
                </div>
            )}
        </div>
    );
};

ChessSquare.displayName = "ChessSquare";

export default ChessSquare;