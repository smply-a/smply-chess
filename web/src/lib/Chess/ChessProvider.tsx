"use client"

import { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from "react"
import { newBoard } from "./board"
import { getMoves, makeMove, Move } from "./movegen"
import { BoardState, Color, getColor, getIndex, Square } from "./types"

export { MatchProvider, useMatch, type Interaction }

interface MatchState  {
    boardState: BoardState
    history: Move[]
} 

function newMatch(): MatchState {
    return {
        boardState: newBoard(),
        history: []
    }
}

type MatchAction = 
    | {type: "MAKE_MOVE"; move: Move}
    | {type: "RESET_GAME";}

function matchReducer(state: MatchState, action: MatchAction) {
    switch (action.type) {
        case "MAKE_MOVE":
            // todo handle clock mybe??
            return {
                boardState: makeMove(state.boardState, action.move),
                history: [...state.history, action.move]
            }

        case "RESET_GAME":
            return {
                boardState: newBoard(),
                history: []
            }
        default: assertNever(action)
    }
}

interface MatchContex {
    matchState: MatchState,
    dispatch: Dispatch<MatchAction> ,
    orientation: Color,
    toggleOrientation: () => void,
    interaction: Interaction,
    handleSelect: (square: Square) => void,
    handlePromotion: (move: Move) => void,
    cancelPromotion: () => void,
}

const MatchContext = createContext<MatchContex|null>(null)

type Interaction = 
    | {type: "idle"}
    | {type: "selected", square: Square, moves: Move[]}
    | {type: "promoting", square: Square ,moves: Move[]} 

const MatchProvider = ({children}: {children: ReactNode}) => {

    const [matchState, dispatch] = useReducer(matchReducer, newMatch())

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
                const piece = matchState.boardState.board[getIndex(square)]
                if (piece && matchState.boardState.turn === getColor(piece)) {
                    return setInteraction({ type: "selected", square, moves: getMoves(piece, matchState.boardState, square) })
                }

                return setInteraction({ type: "idle" })
            }
            
            case "idle": {
                const piece = matchState.boardState.board[getIndex(square)]

                // ignore invalid 
                if (!piece || matchState.boardState.turn !== getColor(piece)) return

                return setInteraction({type: "selected", square, moves: getMoves(piece, matchState.boardState, square)})
            }

            default: return assertNever(interaction)
        }
    }

    return (
        <MatchContext.Provider value={{matchState, toggleOrientation, dispatch, orientation, interaction, handlePromotion, handleSelect, cancelPromotion}}>{children}</MatchContext.Provider>
    )
}

const useMatch = () => {
    const ctx = useContext(MatchContext)
    if (!ctx) throw new Error("Can only use Match contex within its Provider")
    return ctx
}


function assertNever(x: never): never {
    throw new Error("Unhandled action: " + JSON.stringify(x))
}