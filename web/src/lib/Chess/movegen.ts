import { Board, BoardState, CastlingRights, Color, getColor, getFile, getIndex, getRank, Piece, Rank, Square, toSquare } from "./types";


export { getMoves, type Move, type MoveType };

type PieceType = Lowercase<Piece>
type PromotionType = Exclude<PieceType, "p" | "k">

type MoveType = "normal" | "capture" | "en-passant" | "castle-king-side" | "castle-queen-side"

interface Move {
    type: MoveType
    promotion?: PromotionType
    from: Square
    to: Square
}

function newMove(type: MoveType, from: Square, to: Square): Move {
    return {
        type,
        from,
        to,
    }
}

function newPromotionMoves(type: MoveType, from: Square, to: Square,): Move[] {
    const promotions: PromotionType[] = ["b", "n", "r", "q"]
    return promotions.map(promotion => ({
        type, 
        from, to,
        promotion
    }))
}
 
function getMoves(piece: Piece, boardState: BoardState, square: Square): Move[] {
    const {board, enPassantTarget, castlingRights, turn } = boardState
    
    switch (piece.toLowerCase() as PieceType) {
        case "p":
            return getPawnMoves(square, turn, board, enPassantTarget)
        case "n":
            return getKnightMoves(square, turn, board)
        case "b":
            return getSlidingMoves(square, turn, board, [9, 7, -7, -9])
        case "r":
            return getSlidingMoves(square, turn, board, [8, -8, 1, -1])
        case "q":
            return getSlidingMoves(square, turn, board, [
                9, 7, -7, -9, // bishop
                8, -8, 1, -1, // rook
            ])
        case "k":
            return getKingMoves(square, turn, board, castlingRights)
    }
}
// todo pinned ???
function getPawnMoves(square: Square, turn: Color, board: Board, enPassantTarget: Square | null): Move[] {
    // * A pawn can never be in the last rank
    const moves: Move[] = []

    const rank = getRank(square)
    const file = getFile(square)
    const index = getIndex(square)

    let index1front = index
    let index2front = index
    let startRank: Rank

    if (turn === Color.White) {
        index1front += 8
        index2front += 8 * 2
        startRank = Rank.Two
    } else {
        index1front -= 8
        index2front -= 8 * 2
        startRank = Rank.Seven
    }

    const attackRank = getRank(index1front)
    // pawn can only "reach" end when promoting
    const promotion = attackRank === Rank.One || attackRank === Rank.Eight


    // pawn push (1 rank)
    if (!board[index1front]) {
        if (promotion) {
            moves.push(...newPromotionMoves("normal", square, toSquare(index1front)))
        } else {
            moves.push(newMove("normal", square, toSquare(index1front)))
        }

        // pawn push (2 ranks)
        if (rank === startRank && !board[index2front]) {
            moves.push(newMove("normal", square, toSquare(index2front)))
        }
    }
    
    const attacks: number[] = []
    if (file < 7) attacks.push(1) 
    if (file > 0) attacks.push(-1)

    for (const offset of attacks) {
        const attackIndex = index1front + offset 
        const targetSquare = toSquare(attackIndex)
        const occupant = board[attackIndex]

        if (occupant && getColor(occupant) !== turn) {
            if (promotion) {
                moves.push(...newPromotionMoves("capture", square, targetSquare))
            } else {
                moves.push(newMove("capture", square, targetSquare))
            }
        } else if (enPassantTarget && getIndex(enPassantTarget) === attackIndex) {
            moves.push(newMove("en-passant", square, enPassantTarget))
        }
    }

    return moves
}

function getKnightMoves(square: Square, turn: Color, board: Board): Move[] {
    const moves: Move[] = []
    const attacks = [17, 15, 10, 6, -6, -10, -15, -17]

    const index = getIndex(square)
    const fromFile = getFile(square)

    for (const attack of attacks) {
        const attackIndex = index + attack
        
        if (attackIndex < 64 && attackIndex >= 0) {
            const targetSquare = toSquare(attackIndex)
            const targetFile = getFile(targetSquare)

            if (Math.abs(targetFile - fromFile) > 2) {
                continue
            }

            const occupant = board[attackIndex]

            if (!occupant) {
                moves.push(newMove("normal", square, targetSquare))
            } else if (getColor(occupant) !== turn) {
                moves.push(newMove("capture", square, targetSquare))
            }
        }
    }

    return moves
}

function getSlidingMoves(square: Square, turn: Color, board: Board, offsets: number[]): Move[] {
    const moves: Move[] = []
    const index = getIndex(square)

    for (const offset of offsets) {
        let attackIndex = index

        while (true) {
            const prevFile = getFile(attackIndex)
            attackIndex += offset

            if (attackIndex < 0 || attackIndex >= 64) break

            const nextFile = getFile(attackIndex)
            
            // weil gerade aus dasselbe file ist: ">" statt "!="
            if (Math.abs(nextFile - prevFile) > 1) break

            const occupant = board[attackIndex]
            const targetSquare = toSquare(attackIndex)

            if (!occupant) {
                moves.push(newMove("normal", square, targetSquare))
            } else {
                if (getColor(occupant) !== turn) {
                    moves.push(newMove("capture", square, targetSquare))
                }
                break
            }
        }
    }

    return moves
}

function getKingMoves(square: Square, turn: Color, board: Board, castlingRights: CastlingRights): Move[] {
    const moves: Move[] = []
    const attacks = [9, 8, 7, 1, -1, -7, -8, -9]

    const index = getIndex(square)
    const fromFile = getFile(square)

    // todo bedrohte felder und schach

    for (const attack of attacks) {
        const attackIndex = index + attack

        if (attackIndex < 64 && attackIndex >= 0) {
            const targetSquare = toSquare(attackIndex)
            const targetFile = getFile(targetSquare)

            if (Math.abs(targetFile - fromFile) > 1) {
                continue
            }

            const occupant = board[attackIndex]

            if (!occupant) {
                moves.push(newMove("normal", square, targetSquare))
            } else if (getColor(occupant) !== turn) {
                moves.push(newMove("capture", square, targetSquare))
            }
        }
    }

    if (castlingRights[turn].kingSide && !board[index + 1] && !board[index + 2]) {
        moves.push(newMove("castle-king-side", square, toSquare(index + 2)))
    }

    if (castlingRights[turn].queenSide && !board[index - 1] && !board[index - 2] && !board[index - 3]) {
        moves.push(newMove("castle-queen-side", square, toSquare(index - 2)))
    }

    return moves
}