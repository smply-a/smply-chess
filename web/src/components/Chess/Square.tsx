import { Piece } from "@/lib/Chess/types";

interface Props {
    piece: Piece | null;
    isWhite: boolean;
    isSelected: boolean;
    isPossibleMove?: boolean;
    onClick: () => void
}

const ChessSquare = ({piece, isWhite, isSelected, isPossibleMove, onClick}: Props) => {

    const color = isSelected ? "bg-gray-400" : isWhite ? "bg-white" : "bg-black"
    const textColor = isWhite ? "text-black" : "text-white"

    return (<div
        className={
            `flex justify-center items-center cursor-pointer aspect-square 
            ${color} ${textColor}`
        }
        onClick={onClick}
    >
        {piece ? piece : isPossibleMove ? "+" : ""}
    </div>)
}

export default ChessSquare