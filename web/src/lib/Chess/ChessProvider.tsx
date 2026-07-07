"use client"

import { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from "react"
import { newBoard } from "./board"
import { getLegalMoves, kingInCheck, makeMove, Move } from "./movegen"
import { BoardState, Color, getColor, getIndex, Square, toSquare } from "./types"

export { MatchProvider, useMatch, type Interaction }

interface MatchState  {
    boardState: BoardState
    history: Move[]
    legalMoves: {moves: Move[][], total: number}
    inCheck: boolean
    isCheckMate: boolean;
    isStaleMate: boolean;
} 

type MatchAction = 
    | {type: "MAKE_MOVE"; move: Move}
    | {type: "RESET_GAME";}

function matchReducer(state: MatchState, action: MatchAction) {
    switch (action.type) {
        case "MAKE_MOVE":{
            // todo handle clock mybe??
            const boardState = makeMove(state.boardState, action.move)
            const inCheck = kingInCheck(boardState, boardState.turn);
            const legalMoves = getAllLegalMoves(boardState)

            const isCheckMate =  inCheck && legalMoves.total === 0
            let isStaleMate = false
            if(!inCheck && legalMoves.total === 0) isStaleMate = true
            // todo other stalemate conditions

            return {
                boardState,
                history: [...state.history, action.move],
                inCheck,
                legalMoves,
                isCheckMate,
                isStaleMate
            }
        }       
        case "RESET_GAME":{
            return newMatch()
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
                const piece = matchState.boardState.board[index]
                if (piece && matchState.boardState.turn === getColor(piece)) {
                    return setInteraction({ type: "selected", square, moves: matchState.legalMoves.moves[index] })
                }

                return setInteraction({ type: "idle" })
            }
            
            case "idle": {
                const piece = matchState.boardState.board[index]

                // ignore invalid 
                if (!piece || matchState.boardState.turn !== getColor(piece)) return

                return setInteraction({type: "selected", square, moves: matchState.legalMoves.moves[index]})
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

function newMatch(): MatchState {
    const boardState = newBoard()
    return {
        boardState,
        history: [],
        inCheck: false,
        legalMoves: getAllLegalMoves(boardState),
        isCheckMate: false,
        isStaleMate: false,
    }
}

function getAllLegalMoves(boardState: BoardState) {
    let total = 0
    const map: Move[][] = new Array(64).fill(null).map(() => [])
    const { board, turn } = boardState

    for (let i = 0; i < 64; i++) {
        const piece = board[i]
        if (!piece || getColor(piece) !== turn) continue

        const square = toSquare(i)
        const moves = getLegalMoves(piece, boardState, square)
        map[i] = moves
        total += moves.length
    }

    return { moves: map, total }
}

function assertNever(x: never): never {
    throw new Error("Unhandled action: " + JSON.stringify(x))
}