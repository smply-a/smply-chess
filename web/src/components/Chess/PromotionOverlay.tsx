import { displayVsStateIndex } from "@/lib/Chess/board"
import { Move } from "@/lib/Chess/movegen"
import { Color, getIndex, Rank } from "@/lib/Chess/types"
import PieceComponent from "./Piece"


interface Props {
    promotionMoves: Move[],
    orientation: Color,
    onCancel: () => void,
    onPromote: (move: Move) => void
}




const PromotionOverlay = ({promotionMoves, orientation, onCancel, onPromote}: Props) => {

    // eslint-disable-next-line
    const [_, promFile, promRank] =  displayVsStateIndex(getIndex(promotionMoves[0].to), orientation)


    return (<>
        <div 
            // "absolute" orientier sich am äußeren chess board mit relative
            className="z-10 absolute inset-0 bg-black/50 transition-all duration-200"
            onClick={() => onCancel()}
        />
            
        <div
            className={`
                z-20 absolute flex ${promRank === Rank.One ? "flex-col" : "flex-col-reverse"}
                bg-action-primary shadow-xl
            `}
            style={{
                left: `${promFile * 100/8}%`, 
                width: `${100/8}%`,
                height: `${100/2}%`,
                top: promRank === Rank.One ? "0" : "auto",
                bottom: promRank === Rank.Eight ? "0" : "auto",
            }}
        >
            {promotionMoves.map(move => {
                const piece = move.promotion
                if (!piece) throw new Error("Expected promotion piece but found none")

                return (
                    <button
                        key={move.to + piece}
                        className="
                            w-full h-1/4 flex justify-center items-center 
                            hover:bg-square-hover transition-colors duration-75
                        "
                        onClick={() => onPromote(move)}
                    >
                        <PieceComponent piece={piece}/>
                    </button>
                )
            })}
        </div>
    
    </>)
}

export default PromotionOverlay