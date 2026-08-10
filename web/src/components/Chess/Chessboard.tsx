"use client"
import { useChessDispatch, useChessState } from "@/components/chess/ChessProvider"
import { usePreferences } from "@/components/Match/PreferencesProvider"
import { displayVsStateIndex } from "@/lib/Chess/board"
import { Board, BoardState, EngineMove, getColor, getIndex, getPieceType, Square, toSquare } from "@/lib/Chess/types"
import { assertNever } from "@/lib/utils/idk"
import { useState } from "react"
import MatchEndOverlay from "./EndOverlay"
import PromotionOverlay from "./PromotionOverlay"
import ChessSquare from "./Square"

// TODO input via keyboard
// todo winning conditions und overlay

type Interaction = 
    | {type: "idle"}
    | {type: "selected", square: Square, moves: EngineMove[]}
    | {type: "promoting", square: Square, moves: EngineMove[]} 

export const ChessBoard = () => {

    const {orientation} = usePreferences()
    const chessState = useChessState()
    const dispatch = useChessDispatch()
    const [interaction, setInteraction] = useState<Interaction>({type: "idle"})

    const {history, inCheck, boardState, matchEnd} = chessState
    const {turn} = boardState

    const lastMove = history.at(-1)
    const board = getDisplayBoard(boardState, interaction)
    
    const cancelPromotion = () => {
        setInteraction({type: "idle"})
        return
    }
    
    const handlePromotion = (move: EngineMove) => {
        dispatch({
            type: "MAKE_MOVE",
            move
        })
        setInteraction({type: "idle"})
        return
    }
    
    const handleSelect = (square: Square) => {
        const index = getIndex(square)
        switch (interaction.type) {
            // dont handle squares while promoting
            case "promoting": return
    
            case "selected": {
                // toggle square
                if (square === interaction.square) {
                    return setInteraction({ type: "idle" })
                }
    
                const moves = interaction.moves.filter(move => move.to === square)
    
                // promotions have 4 moves on same square
                if (moves.length > 1) {
                    return setInteraction({ type: "promoting", moves, square })
                }
                // normal move
                if (moves.length === 1) {
                    dispatch({ type: "MAKE_MOVE", move: moves[0] })
                    return setInteraction({ type: "idle" })
                }
    
                // select other piece
                const piece = chessState.boardState.board[index]
                if (piece && chessState.boardState.turn === getColor(piece)) {
                    return setInteraction({ type: "selected", square, moves: chessState.legalMoves.moves[index] })
                }
    
                return setInteraction({ type: "idle" })
            }
                
            case "idle": {
                const piece = chessState.boardState.board[index]
    
                // ignore invalid 
                if (!piece || chessState.boardState.turn !== getColor(piece)) return
    
                return setInteraction({type: "selected", square, moves: chessState.legalMoves.moves[index]})
            }
    
            default: return assertNever(interaction)
        }
    }

    return (
        <section className="">
            {/*relative als anker für overlay*/}
            <div className="relative grid grid-cols-8 grid-rows-8 aspect-square select-none rounded-md overflow-hidden">
                {Array.from({length: 64}).map((_, displayIndex) => {
                    const [index, file, rank] = displayVsStateIndex(displayIndex, orientation)
                    const thisSquare = toSquare(index)
                    const selectedSquare = interaction.type === "selected" ? interaction.square : null;
                    const possibleMove = interaction.type === "selected" ? interaction.moves.filter(move => move.to == thisSquare) : undefined

                    const piece = board[index]
                    const isCheck = inCheck && !!piece && getPieceType(piece) === "k" && getColor(piece) === turn

                    return (<ChessSquare 
                        key={thisSquare}
                        piece={piece}
                        turn={chessState.boardState.turn}
                        isCheck={isCheck}
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
                    />
                }

                {(matchEnd) && <MatchEndOverlay/>}
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