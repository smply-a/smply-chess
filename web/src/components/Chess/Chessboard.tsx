"use client"
import { newBoard } from "@/lib/Chess/board"
import { Move } from "@/lib/Chess/movegen"
import { Color, File, getFile, getIndex, getRank, Rank, Square, toSquare } from "@/lib/Chess/types"
import { useState } from "react"
import ChessSquare from "./Square"

export const ChessBoard = () => {

    // todo maybe usereducer statt so vielen states
    const [board, setBoard] = useState(newBoard().board)
    const [selectedSquare, setSelectedSquare] = useState<Square|null>(null)
    // todo: maybe possible moves als key value pair? für easy acces?
    const [possibleMoves, setPossibleMoves] = useState<Move[]|null>
    // todo: toggle
    const [orientation, setOrientation] = useState<Color>(Color.White)

    const handleClick = (square: Square) => {
        const isSameSquare = square === selectedSquare;
        const piece = board[getIndex(square)]

        // TODO generate moves

        //TODO on move, abhängig von peace: update state

        if (isSameSquare || !piece) {
            // toggle selection
            setSelectedSquare(null)
        } else {
            setSelectedSquare(square)
        }
    }

    return (
        <div className="grid grid-cols-8 grid-rows-8 aspect-square select-none">
            {Array.from({length: 64}).map((_, displayIndex) => {
                const [index, file, rank] = displayVsStateIndex(displayIndex, orientation)
                const thisSquare = toSquare(index)

                return (<ChessSquare 
                    key={thisSquare}
                    piece={board[index]}
                    isWhite={(rank + file) % 2 === 1}
                    isSelected={selectedSquare === thisSquare}
                    onClick={() => handleClick(thisSquare)}
                    possibleMove={null}
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