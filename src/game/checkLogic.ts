import {Board} from "./Boards";
// import { Piece } from "./pieces";

export const isKingInCheck = (board: Board, color: "white" | "black"): boolean => {
    // ✅ Проверяем, есть ли король на доске
    let kingPosition: [number, number] | null = null;

    for (let r = 0; r < board.size; r++) {
        for (let c = 0; c < board.size; c++) {
            let piece = board.grid[r][c];
            if (piece && piece.name === "King" && piece.color === color) {
                kingPosition = [r, c];
                break;
            }
        }
    }

    // 🚨 Если король отсутствует на доске — значит, его съели
    if (!kingPosition) {
        console.error(`🚨 Ошибка: король ${color} был побит!`);
        return true; // Возвращаем true, чтобы можно было проверить мат
    }

    const [kingRow, kingCol] = kingPosition;

    // 👀 Проверяем, может ли вражеская фигура атаковать короля
    for (let r = 0; r < board.size; r++) {
        for (let c = 0; c < board.size; c++) {
            let piece = board.grid[r][c];

            if (piece && piece.color !== color) {
                let moves = piece.getAvailableMoves(board.grid);
                if (moves.some(([mr, mc]) => mr === kingRow && mc === kingCol)) {
                    console.log(`⚠️ Шах! Король ${color} под атакой.`);
                    return true;
                }
            }
        }
    }

    return false; // ✅ Шаха нет
};
