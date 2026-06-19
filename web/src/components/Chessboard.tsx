"use client"
import { newBoard } from "@/lib/Chess/rules"
import { useState } from "react"

export const ChessBoard = () => {


    const [board, setBoard] = useState(newBoard().board)


    return (
        <div className="grid grid-cols-8 grid-rows-8">
            {board.map((row, i) =>
                row.map((square, j) => {
                    const isWhite = (i + j) % 2 == 0;

                    return (
                        <div 
                            key={`${i+j}`}
                            className={`flex justify-center items-center ${isWhite ? "bg-white text-black": "bg-black text-white"}`}
                        >
                            {square ? square : ""}
                        </div>
                    )
                })
            )}
        </div>
    )
} 

const initBoard = () => {
    const board = []
    return 
}

export default ChessBoard