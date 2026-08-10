"use client"

import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react"
import { newBoard } from "../../lib/Chess/board"
import { getLegalMoves, getMatchEnd, kingInCheck, makeMove } from "../../lib/Chess/movegen"
import { BoardState, Color, EngineMove, getColor, getIndex, MatchEnd, MatchMove, Piece, toSquare } from "../../lib/Chess/types"
import { assertNever } from "../../lib/utils/idk"

export { ChessProvider, useChessDispatch, useChessState }

interface ChessStateContext {
    boardState: BoardState
    history: MatchMove[]
    legalMoves: {moves: EngineMove[][], total: number}
    capturedMaterial: Record<Color, Piece[]>;
    inCheck: boolean
    matchEnd: MatchEnd | null
}

type Action = 
    | {type: "MAKE_MOVE"; move: EngineMove}
    | {type: "RESET_GAME";}
    | {type: "LOSE_TIME"}

function chessReducer(state: ChessStateContext, action: Action): ChessStateContext {
    switch (action.type) {
        case "MAKE_MOVE":{
            const move = action.move
            // todo handle clock mybe??
        
            let capturedMaterial = state.capturedMaterial
            const capturedPiece = getCapturedPiece(state.boardState, move)
            if (capturedPiece) {
                const turn = state.boardState.turn
                capturedMaterial = { ...state.capturedMaterial, [turn]: [...state.capturedMaterial[turn], capturedPiece] }
            }

            const boardState = makeMove(state.boardState, move)
            const inCheck = kingInCheck(boardState, boardState.turn);
            const legalMoves = getAllLegalMoves(boardState)

            const matchEnd = getMatchEnd(inCheck, legalMoves.total)
            const history = [...state.history, {...move, timestamp: Date.now()}]

            return {
                boardState,
                history,
                inCheck,
                legalMoves,
                matchEnd,
                capturedMaterial
            }
        }       
        case "RESET_GAME":{
            return loadChessContext()
        }
        case "LOSE_TIME":{
            return {
                ...state,
                matchEnd: "time"
            }
        }
        default: assertNever(action)
    }
}

const ChessStateContext = createContext<ChessStateContext|null>(null)
const ChessDispatchContext = createContext<Dispatch<Action>|null>(null)

const ChessProvider = ({children, history}: {children: ReactNode, history?: MatchMove[]}) => {
    const [chessState, dispatch] = useReducer(chessReducer, loadChessContext(history))

    return (
        <ChessStateContext.Provider value={chessState}>{
            <ChessDispatchContext.Provider value={dispatch}>{
                children}
            </ChessDispatchContext.Provider>
        }</ChessStateContext.Provider>
    )
}

const useChessState = () => {
    const ctx = useContext(ChessStateContext)
    if (!ctx) throw new Error("Can only use ChessContext within its Provider")
    return ctx
}

const useChessDispatch = () => {
    const ctx = useContext(ChessDispatchContext)
    if (!ctx) throw new Error("Can only use ChessContext within its Provider")
    return ctx
}

function loadChessContext(history?: MatchMove[]): ChessStateContext {
    let boardState = newBoard()
    const capturedMaterial: Record<Color, Piece[]> = {
        [Color.White]: [],
        [Color.Black]: [],
    }
    for (const move of history ?? []) {
        const {type, from, to, promotion} = move
        const turn = boardState.turn
        
        const capturedPiece = getCapturedPiece(boardState, move)
        if(capturedPiece) capturedMaterial[turn].push(capturedPiece)

        boardState = makeMove(boardState, {type, from, to, promotion})
    }

    const inCheck = kingInCheck(boardState, boardState.turn)
    const legalMoves = getAllLegalMoves(boardState)

    return {
        boardState,
        history: history ?? [],
        inCheck,
        legalMoves,
        capturedMaterial,
        matchEnd: getMatchEnd(inCheck, legalMoves.total)
    }
}

function getAllLegalMoves(boardState: BoardState) {
    let total = 0
    const map: EngineMove[][] = new Array(64).fill(null).map(() => [])
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

function getCapturedPiece(boardState: BoardState, move: EngineMove): Piece | null {
    if (move.type === "capture") {
        const piece = boardState.board[getIndex(move.to)]
        if (!piece) throw new Error("No piece at capture target")
        return piece
    }
    if (move.type === "en-passant") {
        return boardState.turn === Color.Black ? Piece.WhitePawn : Piece.BlackPawn
    }
    return null
}