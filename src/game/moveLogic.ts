import { Board } from "./Boards.ts";
import { isKingInCheck } from "./checkLogic.ts";

export const movePiece = (
    board: Board,
    fromRow: number, 
    fromCol: number, 
    toRow: number, 
    toCol: number
    // setPromotion?: (promotion: { row: number, col: number, color: "white" | "black" }) => void
): boolean => {
    let piece = board.grid[fromRow][fromCol];

    if (!piece) {
        console.log("Здесь нет фигуры!");
        return false;
    }

    let possibleMoves = piece.getAvailableMoves(board.grid);
    let isValidMove = possibleMoves.some(([r, c]) => r === toRow && c === toCol);

    if (!isValidMove) {
        console.log("Фигура не может так ходить!");
        return false;
    }

    if (!board.grid || !board.grid[fromRow] || !board.grid[toRow]) {
        console.error("Ошибка: `grid` не инициализирована или выходит за границы!");
        return false;
    }

    // ✅ Если на клетке стоит фигура противника — бьём её
    let targetPiece = board.grid[toRow][toCol];
    // if (targetPiece && targetPiece.color !== piece.color) {
    //     console.log("Фигура", targetPiece.name, "будет взята!");
    
    //     // ✅ Проверяем, есть ли фигура в capturedPieces перед добавлением
    //     if (!board.capturedPieces.includes(targetPiece)) {
    //         board.capturedPieces.push(targetPiece);
    //     }
    // }
    

    // Обновляем положение фигуры
    board.grid[fromRow][fromCol] = null;
    board.grid[toRow][toCol] = piece;
    piece.setPosition(toRow, toCol);

    console.log(`Фигура ${piece.name} (${piece.color}) переместилась на [${toRow}, ${toCol}]`);

    let simulatedBoard = new Board();
    simulatedBoard.grid = board.grid.map(row => [...row]); // Копируем текущее состояние доски
    simulatedBoard.grid[toRow][toCol] = piece;
    simulatedBoard.grid[fromRow][fromCol] = null;

     // ✅ Проверяем, не попадает ли король под шах после хода
     if (piece.name === "King" && isKingInCheck(simulatedBoard, piece.color)) {
        console.log("❌ Нельзя сделать этот ход – король попадёт под шах!");
        return false;
    }

    // ❌ Запрещаем ход, если после него король будет под шахом
    if (isKingInCheck(simulatedBoard, piece.color)) {
        console.log("❌ Нельзя сделать этот ход – король попадёт под шах!");
        return false;
    }
    
    if (board.grid.length === 0 || board.grid.some(row => row.length === 0)) {
        return false; // Не проверяем мат, если доска еще не загружена
    }
    // ✅ Проверяем, поставлен ли мат (если король побит)
    const whiteKingExists = board.grid.flat().some(p => p?.name === "King" && p.color === "white");
    const blackKingExists = board.grid.flat().some(p => p?.name === "King" && p.color === "black");
    
    if (!whiteKingExists) {
        console.log("♜ Мат! Белый король отсутствует. Победили чёрные!");
        alert("♜ Мат! Победили чёрные!");
    }
    
    if (!blackKingExists) {
        console.log("♜ Мат! Чёрный король отсутствует. Победили белые!");
        alert("♜ Мат! Победили белые!");
    }

    // ✅ Проверяем, достигла ли пешка конца доски
    if (piece.name === "Pawn" && (toRow === 0 || toRow === 7)) {
        console.log(`♟ Пешка достигла конца доски на (${toRow}, ${toCol})!`);
        return true  // ✅ Теперь строка корректно возвращается
    }

    if (targetPiece && targetPiece.color !== piece.color) {
        console.log("🔴 Фигура побита:", targetPiece);
        board.capturedPieces.push(targetPiece);
        console.log("Список побитых фигур:", board.capturedPieces);
    }
    
    
    
    return true;
};
