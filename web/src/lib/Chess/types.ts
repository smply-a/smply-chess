export { Color, File, getColor, getFile, getIndex, getPieceType, getRank, isBoard, isColor, isPiece, isSquare, Piece, Rank, toSquare, type Board, type BoardState, type CastlingRights, type PieceType, type PromotionType, type Square };

enum Color {
    White = "w",
    Black = "b"
}

function isColor(str: string): str is Color {
    const color = /^[wb]$/;
    return color.test(str);
}

function getColor(piece: Piece) {
    if (piece.toUpperCase() == piece) {
        return Color.White
    }
    return Color.Black
}

enum Piece {
    WhitePawn = "P",
    WhiteKnight = "N",
    WhiteBishop = "B",
    WhiteRook = "R",
    WhiteQueen = "Q",
    WhiteKing = "K",

    BlackPawn = "p",
    BlackKnight = "n",
    BlackBishop = "b",
    BlackRook = "r",
    BlackQueen = "q",
    BlackKing = "k"
}  

type PieceType = Lowercase<Piece>
type PromotionType = Exclude<PieceType, "p" | "k">

function isPiece(str: string): str is Piece {
    const piece = /^[pnbrqkPNBRQK]$/;
    return piece.test(str);
}

function getPieceType(piece: Piece): PieceType {
    return piece.toLocaleLowerCase() as PieceType
}

enum Rank {
    One = 0,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight
}
const RANK_NAMES = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

function getRank(index: number): Rank
function getRank(square: Square): Rank
function getRank(squareOrIndex: number | Square): Rank {
    if (typeof squareOrIndex === "number") {
        if (squareOrIndex < 0 || squareOrIndex > 63) {
            throw new Error("Index out of bounds (0-63)");
        }
        return Math.floor(squareOrIndex / 8) as Rank;
    } else {
        const rank = RANK_NAMES.indexOf(squareOrIndex[1] as typeof RANK_NAMES[number])
        if (rank === -1) throw new Error("Could not extrack Rank from square")
        else return rank as Rank 
    }
}

enum File {
    A = 0,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
}
const FILE_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

function getFile(index: number): File
function getFile(square: Square): File
function getFile(squareOrIndex: number | Square): File {
    if (typeof squareOrIndex === "number") {
        if (squareOrIndex < 0 || squareOrIndex > 63) {
            throw new Error("Index out of bounds (0-63)")
        }
        return (squareOrIndex % 8) as File
    } else {
        const file = FILE_NAMES.indexOf(squareOrIndex[0] as typeof FILE_NAMES[number])
        if (file === -1) throw new Error("Could not extract File from square")
        return file as File
    }
}

function getIndex(square: Square): number {
    const rank = getRank(square)
    const file = getFile(square)

    return rank * 8 + file
}

type Square = `${typeof FILE_NAMES[number]}${typeof RANK_NAMES[number]}`
function isSquare(str: string): str is Square {
    const square = /^[A-H][1-8]$/;
    return square.test(str)
}

function toSquare(file: File, rank: Rank): Square
function toSquare(index: number): Square
function toSquare(fileOrIndex: number, rank?: number): Square {
    // from index
    if (rank === undefined) {
        if (fileOrIndex < 0 || fileOrIndex > 63 ) throw new Error("Square index out of bound (0-63");
        const rank = Math.floor(fileOrIndex / 8)
        const file = fileOrIndex % 8

        return toSquare(file, rank)
    }

    const file = fileOrIndex;

    if (file < 0 || file > 7 || rank < 0 || rank > 7) {
        throw new Error("File or Rank out of bounds (0-7)");
    }
    const square = `${FILE_NAMES[file]}${RANK_NAMES[rank]}`
    if (isSquare(square)) return square
    else throw new Error("Error while parsing to square")
}

type Board = [
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
    Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,
]
function isBoard(matrix: unknown[]): matrix is Board  {
    return matrix.every(square => isPiece(square as string) || square === null) && matrix.length === 64
}

type castlingSide = {
    kingSide: boolean,
    queenSide: boolean
}
type CastlingRights = {
    [K in Color]: castlingSide
}

interface BoardState {
    board: Board,
    turn: Color,
    castlingRights: CastlingRights,
    enPassantTarget: Square | null,
    halfmoveClock: number,
    fullmoveNumber: number
}