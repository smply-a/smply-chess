export enum Color {
    White = "w",
    Black = "b"
}

export function isColor(str: string): str is Color {
    const color = /^[wb]$/;
    return color.test(str);
}

export enum Piece {
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

export function isPiece(str: string): str is Piece {
    const piece = /^[pnbrqkPNBRQK]$/;
    return piece.test(str);
} 

enum Rank {
    One = "1",
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8"
}

enum File {
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
}

export type Square = `${File}${Rank}`
export function isSquare(str: string): str is Square {
    const square = /^[a-h][1-8]/;
    return square.test(str)
}   

type Row = [Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null, Piece | null,]
export type Board = [Row, Row, Row, Row, Row, Row, Row, Row]
export function isBoard(matrix: unknown[][]): matrix is Board  {
    if (matrix.length !== 8) return false;

    return matrix.every(
        row => row.length === 8
        && row.every(square => isPiece(square as string) || square === null) 

    )
}

type castlingSide = {
    kingSide: boolean,
    queenSide: boolean
}
export type CastlingRights = {
    [K in Color]: castlingSide
}

export interface BoardState {
    board: Board,
    turn: Color,
    castlingRights: CastlingRights,
    enPassantTarget: Square | null,
    halfmoveClock: number,
    fullmoveNumber: number
}