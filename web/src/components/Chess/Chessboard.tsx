"use client"
import { newBoard } from "@/lib/Chess/board"
import { getMoves, makeMove, Move } from "@/lib/Chess/movegen"
import { BoardState, Color, File, getFile, getIndex, getRank, Rank, Square, toSquare } from "@/lib/Chess/types"
import { useReducer, useState } from "react"
import ChessSquare from "./Square"

export const ChessBoard = () => {
    const [gameState, dispatch] = useReducer(chessReducer, null, newBoard)

    const [selectedSquare, setSelectedSquare] = useState<Square|null>(null)
    // todo: maybe possible moves als key value pair? für easy acces? bzw precalc all moves for a colors turn? [index]Move[]
    const [possibleMoves, setPossibleMoves] = useState<Move[]|null>(null)

    // todo: toggle
    const [orientation, setOrientation] = useState<Color>(Color.White)

    const handleClick = (square: Square) => {
        const isSameSquare = square === selectedSquare;
        const piece = gameState.board[getIndex(square)]

        //TODO handle captures with indicators
        const possibleMove = possibleMoves?.find(move => move.to == square)

        if (possibleMove) {
            dispatch({
                type: "MAKE_MOVE",
                move: possibleMove
            })
        }

        if (isSameSquare || !piece) {
            setSelectedSquare(null)
            setPossibleMoves(null)
        } else {
            setSelectedSquare(square)
            setPossibleMoves(getMoves(piece, gameState, square))
        }
    }

    return (
        <div className="grid grid-cols-8 grid-rows-8 aspect-square select-none">
            {Array.from({length: 64}).map((_, displayIndex) => {
                const [index, file, rank] = displayVsStateIndex(displayIndex, orientation)
                const thisSquare = toSquare(index)
                const possibleMove = possibleMoves?.find(move => move.to == thisSquare)

                return (<ChessSquare 
                    key={thisSquare}
                    piece={gameState.board[index]}
                    isWhite={(rank + file) % 2 === 1}
                    isSelected={selectedSquare === thisSquare}
                    onClick={() => handleClick(thisSquare)}
                    isPossibleMove={!!possibleMove}
                />)
            })}
        </div>
    )
} 

export default ChessBoard

function displayVsStateIndex(displayIndex: number, orientation: Color): [index: number, file: File, rank: Rank] {
    let rank = getRank(displayIndex)
    let file = getFile(displayIndex)

    if (orientation === Color.White) {
        rank = 7 - rank
    } else {
        file = 7 - file
    }

    return [rank * 8 + file, file, rank]
}

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