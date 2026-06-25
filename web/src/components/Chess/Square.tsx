import { MoveType } from "@/lib/Chess/movegen";
import { Piece } from "@/lib/Chess/types";

interface Props {
    piece: Piece | null;
    isWhite: boolean;
    isSelected: boolean;
    possibleMove: MoveType | null;
    onClick: () => void
}

const ChessSquare = ({piece, isWhite, isSelected, possibleMove, onClick}: Props) => {

    const color = isSelected ? "bg-gray-400" : isWhite ? "bg-white" : "bg-black"
    const textColor = isWhite ? "text-black" : "text-white"

    return (<div
        className={
            `flex justify-center items-center cursor-pointer aspect-square 
            ${color} ${textColor}`
        }
        onClick={onClick}
    >
        {piece ? piece : ""}
    </div>)
}

export default ChessSquare