import { BoardState, CastlingRights, isBoard, isColor, isPiece, isSquare, Piece } from "./types";

const newGameBoard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const newBoard = () => parseFEN(newGameBoard)

export function parseFEN(fen: string): BoardState {
    const [boardStr, turn, castlingRightsStr, enPassantTargetStr, halfmoveClockStr, fullmoveNumberStr] = fen.split(" ")

    const board: (Piece|null)[][] = (() => {
        return boardStr.split("/").map(rank => {
            const r = []
            for (const char of rank) {
                const num = parseInt(char)
                if (!isNaN(num)) {
                    r.push(...Array(num).fill(null))
                } else if (isPiece(char)) {
                    r.push(char)
                } else {
                    throw new Error("FEN PARSING: piece is not valid")
                }
            }
            return r
        })
    })()

    if (!isBoard(board)) throw new Error("FEN PARSING: board is not valid")

    if (!isColor(turn)) throw new Error("FEN PASRING: turn is no valid color")    
    const halfmoveClock = parseInt(halfmoveClockStr);
    const fullmoveNumber = parseInt(fullmoveNumberStr);

    const castlingRights: CastlingRights = (() => {
        const s = castlingRightsStr

        return {
            "w": {
                kingSide: s.includes("K"),
                queenSide: s.includes("Q")
            },
            "b": {
                kingSide: s.includes("k"),
                queenSide: s.includes("q")
            }
        }
    })()
    
    const enPassantTarget = (() => {
        if (enPassantTargetStr == "-") return null;
        if (isSquare(enPassantTargetStr)) return enPassantTargetStr;
        throw new Error("FEN PARSING: enpassent target is no valid square");
    })()
    

    return {board, turn, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber}
}