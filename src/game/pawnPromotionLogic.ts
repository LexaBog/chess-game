import { Dispatch, SetStateAction } from "react";
import { Board } from "../game/Boards.ts";
import { Piece, Queen, Rook, Bishop, Knight } from "../game/pieces.ts";

interface PromotionData {
    row: number;
    col: number;
    color: "white" | "black";
}

export const promotePawn = (
    board: Board,
    promotion: PromotionData | null,
    pieceType: "Queen" | "Rook" | "Bishop" | "Knight",
    setPromotion: Dispatch<SetStateAction<null>>,
    setBoard: Dispatch<SetStateAction<Board>>,
    setCurrentTurn: Dispatch<SetStateAction<"white" | "black">>
) => {
    if (!promotion) return;

    let { row, col, color } = promotion;

    let newPiece: Piece;
    switch (pieceType) {
        case "Queen":
            newPiece = new Queen(row, col, color, "Queen"); // ✅ Добавлен 4-й аргумент
            break;
        case "Rook":
            newPiece = new Rook(row, col, color, "Rook");
            break;
        case "Bishop":
            newPiece = new Bishop(row, col, color, "Bishop");
            break;
        case "Knight":
            newPiece = new Knight(row, col, color, "Knight");
            break;
        default:
            return;
    }

    board.grid[row][col] = newPiece; // Заменяем пешку
    setPromotion(null);

    // Обновляем доску, создавая новый объект, но копируя старую доску
    setBoard(prevBoard => {
        let newGrid = prevBoard.grid.map(row => [...row]);
        newGrid[row][col] = newPiece;
    
        let updatedBoard = new Board(); // Создаём новую доску
        updatedBoard.grid = newGrid; // Присваиваем обновлённую сетку
    
        return updatedBoard;
    });
    

    setCurrentTurn(prev => (prev === "white" ? "black" : "white"));
};
