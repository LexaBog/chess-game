import { Board } from "./Boards.ts";
import { isKingInCheck } from "./checkLogic.ts";

export const movePiece = (
    board: Board,
    fromRow: number, 
    fromCol: number, 
    toRow: number, 
    toCol: number
): boolean | "promotion" => {
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
    if (targetPiece && targetPiece.color !== piece.color) {
        console.log("Фигура", targetPiece.name, "будет взята!");
        board.capturedPieces.push(targetPiece);
    }

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
    
    // ✅ Проверяем, поставлен ли мат (если король побит)
    if (!board.grid.flat().some(p => p?.name === "King" && p.color !== piece.color)) {
        console.log(`♜ Мат! Король ${piece.color === "white" ? "чёрных" : "белых"} побит!`);
        alert(`♜ Мат! Победили ${piece.color === "white" ? "белые" : "чёрные"}!`);
        return true;
    }

    // ✅ Проверяем, достигла ли пешка конца доски
    if (piece.name === "Pawn" && (toRow === 0 || toRow === 7)) {
        console.log(`♟ Пешка достигла конца доски на (${toRow}, ${toCol})!`);
        return "promotion";  // ✅ Теперь строка корректно возвращается
    }
    
    return true;
};
