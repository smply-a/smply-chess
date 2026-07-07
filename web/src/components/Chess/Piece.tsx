import { pieceMapping } from "@/lib/Chess/board"
import { Piece } from "@/lib/Chess/types"
import Image from "next/image"

interface Props {
    piece: Piece
}

const PieceComponent = ({piece}: Props) => {
    return (
        <div className={"relative w-full h-full"}>
            {piece && <Image 
                src={pieceMapping[piece]} 
                alt={piece} 
                fill
                unoptimized
                priority
                draggable={false}
            />}
        </div>
    )
}

export default PieceComponent