"use client"
import { displayVsStateIndex, newBoard } from "@/lib/Chess/board"
import { getMoves, makeMove, Move } from "@/lib/Chess/movegen"
import { Board, BoardState, Color, getColor, getIndex, Square, toSquare } from "@/lib/Chess/types"
import { useReducer, useState } from "react"
import PromotionOverlay from "./PromotionOverlay"
import ChessSquare from "./Square"

// TODO input via keyboard

type Interaction = 
    | {type: "idle"}
    | {type: "selected", square: Square, moves: Move[]}
    | {type: "promoting", square: Square ,moves: Move[]}  

// todo wenn enterien propotion selection screen, pawn sollte auch dort hin "laufen, 
// aber wieder zurrück falls abbruch"

export const ChessBoard = () => {
    const [gameState, dispatch] = useReducer(chessReducer, null, newBoard)

    const [interaction, setInteraction] = useState<Interaction>({type: "idle"})
    
    // todo: toggle
    const [orientation, setOrientation] = useState<Color>(Color.White)

    const cancelPromotion = () => {
        setInteraction({type: "idle"})
        return
    }

    const handlePromotion = (move: Move) => {
        dispatch({
            type: "MAKE_MOVE",
            move
        })
        setInteraction({type: "idle"})
        return
    }

    const handleSelect = (square: Square) => {
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
                const piece = gameState.board[getIndex(square)]
                if (piece && gameState.turn === getColor(piece)) {
                    return setInteraction({ type: "selected", square, moves: getMoves(piece, gameState, square) })
                }

                return setInteraction({ type: "idle" })
            }
            
            case "idle": {
                const piece = gameState.board[getIndex(square)]

                // ignore invalid 
                if (!piece || gameState.turn !== getColor(piece)) return

                return setInteraction({type: "selected", square, moves: getMoves(piece, gameState, square)})
            }

            default: return assertNever(interaction)
        }
    }

    return (
        // relative als anker für overlay
        <div className="grid grid-cols-8 grid-rows-8 aspect-square select-none relative">
            {Array.from({length: 64}).map((_, displayIndex) => {
                const [index, file, rank] = displayVsStateIndex(displayIndex, orientation)
                const thisSquare = toSquare(index)
                const selectedSquare = interaction.type === "selected" ? interaction.square : null;
                const possibleMove = interaction.type === "selected" ? interaction.moves.filter(move => move.to == thisSquare) : undefined

                const board = getDisplayBoard(gameState, interaction)

                return (<ChessSquare 
                    key={thisSquare}
                    piece={board[index]}
                    isWhite={(rank + file) % 2 === 1}
                    isSelected={selectedSquare === thisSquare}
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
    )
} 

export default ChessBoard

type ChessAction = 
    | {type: "MAKE_MOVE"; move: Move}
    | {type: "RESET_GAME";}

function chessReducer(state: BoardState, action: ChessAction) {
    switch (action.type) {
        case "MAKE_MOVE":
            // todo handle clock mybe??
            return makeMove(state, action.move)

        case "RESET_GAME":
            return newBoard()
    }
}

function getDisplayBoard(gameState: BoardState, interaction: Interaction): Board {
    if (interaction.type !== "promoting") return gameState.board

    // "simulate" when promoting
    const board = [...gameState.board]
    // from/to bei allen gleich
    const move = interaction.moves[0]
    const fromIndex = getIndex(move.from)
    const toIndex = getIndex(move.to)

    board[toIndex] = board[fromIndex]
    board[fromIndex] = null

    return board as Board
}

function assertNever(x: never): never {
    throw new Error("Unhandled interaction: " + JSON.stringify(x))
}