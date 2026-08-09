import { Board, BoardState, CastlingRights, Color, EngineMove, getColor, getFile, getIndex, getPieceType, getRank, isBoard, MatchEnd, MoveType, Piece, PromotionType, Rank, Square, toSquare } from "./types";


export { getLegalMoves, getMatchEnd, kingInCheck, makeMove };

function newMove(type: MoveType, from: Square, to: Square): EngineMove {
    return {
        type,
        from,
        to,
    }
}

function newPromotionMoves(type: MoveType, from: Square, to: Square, color: Color): EngineMove[] {
    const promotions: PromotionType[] = ["q", "r", "b", "n"]

    const pieces = color === Color.White 
        ? promotions.map(p => p.toUpperCase() as PromotionType)
        : promotions.map(p => p as PromotionType)

    return pieces.map(promotion => ({
        type,
        from,
        to,
        promotion
    }))
}

const bishopOffsets = [9, 7, -7, -9]
const rookOffsets = [8, -8, 1, -1]


function getMoves(piece: Piece, boardState: BoardState, square: Square): EngineMove[] {
    const {board, enPassantTarget, castlingRights} = boardState
    const pieceColor = getColor(piece)
    
    switch (getPieceType(piece)) {
        case "p":
            return getPawnMoves(square, pieceColor, board, enPassantTarget)
        case "n":
            return getKnightMoves(square, pieceColor, board)
        case "b":
            return getSlidingMoves(square, pieceColor, board, bishopOffsets)
        case "r":
            return getSlidingMoves(square, pieceColor, board, rookOffsets)
        case "q":
            return getSlidingMoves(square, pieceColor, board, [...bishopOffsets, ...rookOffsets])
        case "k":
            return getKingMoves(square, pieceColor, board, castlingRights)
    }
}

function getPawnMoves(square: Square, color: Color, board: Board, enPassantTarget: Square | null): EngineMove[] {
    // * A pawn can never be in the last rank
    const moves: EngineMove[] = []

    const rank = getRank(square)
    const file = getFile(square)
    const index = getIndex(square)

    let index1front = index
    let index2front = index
    let startRank: Rank

    if (color === Color.White) {
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
            moves.push(...newPromotionMoves("normal", square, toSquare(index1front), color))
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

        if (occupant && getColor(occupant) !== color) {
            if (promotion) {
                moves.push(...newPromotionMoves("capture", square, targetSquare, color))
            } else {
                moves.push(newMove("capture", square, targetSquare))
            }
        } else if (enPassantTarget && getIndex(enPassantTarget) === attackIndex) {
            moves.push(newMove("en-passant", square, enPassantTarget))
        }
    }

    return moves
}

function getKnightMoves(square: Square, turn: Color, board: Board): EngineMove[] {
    const moves: EngineMove[] = []
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

function getSlidingMoves(square: Square, turn: Color, board: Board, offsets: number[]): EngineMove[] {
    const moves: EngineMove[] = []
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

function getKingMoves(square: Square, turn: Color, board: Board, castlingRights: CastlingRights): EngineMove[] {
    const moves: EngineMove[] = []
    const attacks = [9, 8, 7, 1, -1, -7, -8, -9]

    const index = getIndex(square)
    const fromFile = getFile(square)

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

// todo add material count
function makeMove({board, turn, enPassantTarget, castlingRights, halfmoveClock, fullmoveNumber}: BoardState, {type, from, to, promotion}: EngineMove): BoardState {

    const toIndex = getIndex(to)
    const fromIndex = getIndex(from)

    const newBoard = [...board]

    let piece = newBoard[fromIndex]
    if (!piece) throw new Error("Move has no valid piece where it moves from")

    if (promotion) piece = promotion as Piece
    
    // pawn related
    if (turn === Color.Black) {
    
        fullmoveNumber += 1

        if (type === "en-passant") {
            // delete victim
            newBoard[toIndex + 8] = null
        }

        
        turn = Color.White

    } else {

        if (type === "en-passant") {
            // delete victim
            newBoard[toIndex - 8] = null
        }

        turn = Color.Black
    }

    // ? Bug when white can make 2 moves in a row (capture)
    enPassantTarget = updateEnPassantTarget(board, toIndex, fromIndex)
    
    const newCastlingRights = updateCastlingRights(castlingRights, to, from, piece)


    // move Piece
    newBoard[fromIndex] = null
    newBoard[toIndex] = piece

    if (type === "castle-king-side") {
        newBoard[toIndex - 1] = newBoard[toIndex + 1]
        newBoard[toIndex + 1] = null
    } else if (type === "castle-queen-side") {
        newBoard[toIndex + 1] = newBoard[toIndex - 2]
        newBoard[toIndex - 2] = null
    }

    if (!isBoard(newBoard)) throw new Error("invalid operation on board while making move")
    return {board: newBoard, turn, enPassantTarget, castlingRights: newCastlingRights, fullmoveNumber, halfmoveClock}
}

// braucht color falls ich einen boardstate nur simuliere
function squareAttacked(square: Square, boardState: BoardState, color: Color) {
    const {board} = boardState
    for (let i = 0; i < 64; i++) {
        const piece = board[i]
        if (!piece || getColor(piece) === color) continue

        const moves = getMoves(piece, boardState, toSquare(i))
        if (moves.some(m => m.to === square)) return true
    }
    return false
}

function getKingIndex(board: Board, color: Color) {
    for (let i = 0; i < 64; i++) {
        const piece = board[i]
        if (piece && getPieceType(piece) === "k" && getColor(piece) === color) {
            return i
        }
    }
    throw new Error("No king on board!!!!")
}

function kingInCheck(boardState: BoardState, color: Color): boolean {
    const { board } = boardState
    const kingSquare = toSquare(getKingIndex(board, color))

    return squareAttacked(kingSquare, boardState, color)
}

function leavesKingInCheck(boardState: BoardState, move: EngineMove): boolean {
    const turn = boardState.turn
    const newState = makeMove(boardState, move)
    return kingInCheck(newState, turn)
}

function getLegalMoves(piece: Piece, boardState: BoardState, square: Square): EngineMove[] {
    const pseudoMoves = getMoves(piece, boardState, square)
    const color = getColor(piece)
    return pseudoMoves.filter(move => {

        if (move.type === "castle-king-side") {
            const kingIdnex = getKingIndex(boardState.board, color)
            return !kingInCheck(boardState, color) 
            && !squareAttacked(toSquare(kingIdnex + 1),boardState, color)
            && !squareAttacked(toSquare(kingIdnex + 2),boardState, color)
        }
        if (move.type === "castle-queen-side") {
            const kingIdnex = getKingIndex(boardState.board, color)
            return !kingInCheck(boardState, color) 
            && !squareAttacked(toSquare(kingIdnex - 1),boardState, color)
            && !squareAttacked(toSquare(kingIdnex - 2),boardState, color)
        }
        
        return !leavesKingInCheck(boardState, move)
    })
}




function isCheckMate(inCheck: boolean, legalMovesTotal: number) {
    return inCheck && legalMovesTotal === 0
}

function isStaleMate(inCheck: boolean, legalMovesTotal: number) {
    if(!inCheck && legalMovesTotal === 0) return true
    // todo other stalemate conditions



    return false
}

function getMatchEnd(inCheck: boolean, legalMovesTotal: number): MatchEnd | null {
    if (isCheckMate(inCheck, legalMovesTotal)) return "mate"
    if (isStaleMate(inCheck, legalMovesTotal)) return "stale"
    return null
}

function isPawn(piece: Piece | null) {
    if (piece) {
        if (getPieceType(piece) === "p") return true
    }
    return false
}

function updateEnPassantTarget(board: Board, toIndex: number, fromIndex: number) {
    const piece = board[fromIndex]
    if (!isPawn(piece)) return null

    const fromRank = getRank(fromIndex);
    const toRank = getRank(toIndex);
    const distance = Math.abs(toRank - fromRank);

    if (distance !== 2) return null

    return toSquare((toIndex + fromIndex) / 2)
}

function updateCastlingRights(rights: CastlingRights, to: Square, from: Square, piece: Piece): CastlingRights {
    const next = {
        [Color.White]: { ...rights[Color.White] },
        [Color.Black]: { ...rights[Color.Black] },
    }

    // King moves
    if (getPieceType(piece) === "k") {
        const color = getColor(piece)
        next[color].kingSide = false
        next[color].queenSide = false
    }

    // Turm zieht vom Eckfeld weg
    const fromEntry = ROOK_CASTLING_SQUARES[from]
    if (fromEntry) {
        const [color, side] = fromEntry
        next[color][side] = false
    }

    // Turm wird auf dem Eckfeld geschlagen
    const toEntry = ROOK_CASTLING_SQUARES[to]
    if (toEntry) {
        const [color, side] = toEntry
        next[color][side] = false
    }

    return next
}

const ROOK_CASTLING_SQUARES: Partial<Record<Square, [Color, "kingSide" | "queenSide"]>> = {
    "A1": [Color.White, "queenSide"],
    "H1": [Color.White, "kingSide"],
    "A8": [Color.Black, "queenSide"],
    "H8": [Color.Black, "kingSide"],
}