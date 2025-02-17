import { Board } from "./Boards";
import { Piece } from "./pieces";

export const canCastle = (board: Board, king: Piece, toCol: number): boolean => {
    console.log(`Проверяем возможность рокировки для ${king.color} короля на ${toCol}`);
    console.log(`Король уже ходил? ${king.hasMoved}`);
    console.log(`Это действительно король? ${king.name === "King"}`);
    console.log(`🔍 Проверяем рокировку для ${king.color} короля на ${toCol}`);
    if (king.hasMoved || king.name !== "King") {
        console.log(`❌ Король уже ходил (${king.hasMoved}) или это не король (${king.name})`);
        return false; 
    }

    let backRank = king.color === "white" ? 7 : 0;
    let rookCol = toCol === 6 ? 7 : 0; // 7 (короткая), 0 (длинная)
    // let newRookCol = toCol === 6 ? 5 : 3;

    let rook = board.grid[backRank][rookCol];

    if (!rook || rook.name !== "Rook" || rook.hasMoved) {
        console.log(`❌ Ладья отсутствует или уже ходила`);
        return false; 
    }

    let direction = rookCol === 7 ? 1 : -1;
    for (let i = king.col + direction; i !== rookCol; i += direction) {
        if (board.grid[backRank][i]) {
            console.log(`❌ Препятствие на пути (${backRank}, ${i})`);
            return false; 
        }
    }

    console.log(`✅ Рокировка возможна!`);
    return true;
};



export const performCastle = (board: Board, king: Piece, toCol: number) => {
    let backRank = king.color === "white" ? 7 : 0;
    let rookCol = toCol === 6 ? 7 : 0;
    let newRookCol = toCol === 6 ? 5 : 3;

    let rook = board.grid[backRank][rookCol];

    if (!rook) return;

    // ✅ Передвигаем короля
    board.grid[king.row][king.col] = null;
    board.grid[backRank][toCol] = king;
    king.setPosition(backRank, toCol);

    // ✅ Передвигаем ладью
    board.grid[backRank][rookCol] = null;
    board.grid[backRank][newRookCol] = rook;
    rook.setPosition(backRank, newRookCol);

    console.log(`Рокировка выполнена: король ${king.color} на ${toCol}, ладья на ${newRookCol}`);
};



