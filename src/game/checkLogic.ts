import {Board} from "./Boards";
// import { Piece } from "./pieces";

export const isKingInCheck = (board: Board, color: "white" | "black"): boolean => {
    // Если короля нет на доске — он был побит, но только не в начале игры!
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

    if (!kingPosition) {
        console.log(`🚨 Ошибка: король ${color} отсутствует на доске!`);
        return false; // ⚠️ Теперь он не считается под шахом
    }

    const [kingRow, kingCol] = kingPosition;

    // Проверяем, атакован ли король противником
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

    
    

    return false;
};

