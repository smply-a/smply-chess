"use client"
import { displayVsStateIndex } from "@/lib/Chess/board"
import { Interaction, useMatch } from "@/lib/Chess/ChessProvider"
import { Board, BoardState, getIndex, toSquare } from "@/lib/Chess/types"
import PromotionOverlay from "./PromotionOverlay"
import ChessSquare from "./Square"

// TODO input via keyboard

// todo wenn enterien propotion selection screen, pawn sollte auch dort hin "laufen, 
// aber wieder zurrück falls abbruch"

export const ChessBoard = () => {
    const {matchState, interaction, orientation, handlePromotion, handleSelect, toggleOrientation, cancelPromotion, } = useMatch()

    const lastMove = matchState.history.at(-1)

    return (
        <section className="p-4 ">
            {/*relative als anker für overlay*/}
            <div className="relative grid grid-cols-8 grid-rows-8 aspect-square select-none rounded-md overflow-hidden">
                {Array.from({length: 64}).map((_, displayIndex) => {
                    const [index, file, rank] = displayVsStateIndex(displayIndex, orientation)
                    const thisSquare = toSquare(index)
                    const selectedSquare = interaction.type === "selected" ? interaction.square : null;
                    const possibleMove = interaction.type === "selected" ? interaction.moves.filter(move => move.to == thisSquare) : undefined

                    const board = getDisplayBoard(matchState.boardState, interaction)

                    return (<ChessSquare 
                        key={thisSquare}
                        piece={board[index]}
                        turn={matchState.boardState.turn}
                        isWhite={(rank + file) % 2 === 1}
                        isSelected={selectedSquare === thisSquare}
                        isLastMove={lastMove?.from === thisSquare || lastMove?.to === thisSquare}
                        onClick={() => handleSelect(thisSquare)}
                        possibleMove={possibleMove}
                    />)
                })}

                {interaction.type === "promoting" && 
            <PromotionOverlay
                promotionMoves={interaction.moves}
                orientation={orientation}
                onCancel={cancelPromotion}
                onPromote={handlePromotion}
            />}
            </div>
        </section>
    )
} 

export default ChessBoard

// for rollback: "simulate pawn move while promoting"
function getDisplayBoard(gameState: BoardState, interaction: Interaction): Board {
    if (interaction.type !== "promoting") return gameState.board

    const board = [...gameState.board]
    const move = interaction.moves[0]
    const fromIndex = getIndex(move.from)
    const toIndex = getIndex(move.to)

    board[toIndex] = board[fromIndex]
    board[fromIndex] = null

    return board as Board
}