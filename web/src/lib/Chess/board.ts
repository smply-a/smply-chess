import { Board, BoardState, CastlingRights, Color, File, getFile, getRank, isBoard, isColor, isPiece, isSquare, Piece, Rank } from "./types";

export { displayVsStateIndex, getKingIndex, newBoard, parseFEN, pieceMapping };

const newBoard = () => parseFEN(newGameBoard)

function parseFEN(fen: string): BoardState {
    const [boardStr, turn, castlingRightsStr, enPassantTargetStr, halfmoveClockStr, fullmoveNumberStr] = fen.split(" ")

    const board: (Piece|null)[] = (() => {
        return boardStr.split("/").reverse().flatMap(rank => {
            const r: (Piece|null)[] = []
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

const pieceMapping: Record<Piece, string> = {
    "p": "/pieces/p.svg",
    "k": "/pieces/k.svg",
    "n": "/pieces/n.svg",
    "q": "/pieces/q.svg",
    "r": "/pieces/r.svg",
    "b": "/pieces/b.svg",
    "P": "/pieces/wp.svg",
    "K": "/pieces/wk.svg",
    "N": "/pieces/wn.svg",
    "Q": "/pieces/wq.svg",
    "R": "/pieces/wr.svg",
    "B": "/pieces/wb.svg",
}

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

function getKingIndex(color: Color, board: Board): number {
    const king = color === Color.Black ? Piece.BlackKing : Piece.WhiteKing
    for (let i = 0; i<64; i++) {
        if (board[i] === king) return i
    }
    throw new Error("King is not on board")
}

// Constants
const newGameBoard = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";