"use client"

import { createContext, ReactNode, useContext, useState } from "react";
import { assertNever } from "../utils/idk";
import { useChessDispatch, useChessState } from "./ChessProvider";
import { Color, EngineMove, getColor, getIndex, Square } from "./types";

export { InteractionProvider, useInteraction, useOrientation, type Interaction };

type Interaction = 
    | {type: "idle"}
    | {type: "selected", square: Square, moves: EngineMove[]}
    | {type: "promoting", square: Square, moves: EngineMove[]} 

interface InteractionContext {
    interaction: Interaction,
    handleSelect: (square: Square) => void,
    handlePromotion: (move: EngineMove) => void,
    cancelPromotion: () => void,
}
const InteractionContext = createContext<InteractionContext|null>(null)

interface OrientationContext {
    orientation: Color,
    toggleOrientation: () => void,
}
const OrientationContext = createContext<OrientationContext|null>(null)

const InteractionProvider = ({children}: {children: ReactNode}) => {
    // * Use context
    const chessState = useChessState() 
    const dispatch = useChessDispatch()   

    // Handle stuff
    const [interaction, setInteraction] = useState<Interaction>({type: "idle"})
    // todo other default orientation
    const [orientation, setOrientation] = useState<Color>(Color.White)

    const toggleOrientation = () => {
        if (orientation === Color.White) {
            return setOrientation(Color.Black)
        }

        return setOrientation(Color.White)
    }

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
        <InteractionContext.Provider value={{interaction, handlePromotion, handleSelect, cancelPromotion}}>
            <OrientationContext.Provider value={{orientation, toggleOrientation}}>
                {children}
            </OrientationContext.Provider>
        </InteractionContext.Provider>
    )
}

const useInteraction = () => {
    const ctx = useContext(InteractionContext)
    if (!ctx) throw new Error("can only access interaction context within its provider")
    return ctx
}

const useOrientation = () => {
    const ctx = useContext(OrientationContext)
    if (!ctx) throw new Error("can only access interaction context within its provider")
    return ctx
}