export type BoardGrid = (Piece | null)[][];

export abstract class Piece {
    position: [number, number];
    color: "white" | "black";
    name: string;
    hasMoved: boolean = false;

    constructor(row: number, col: number, color: "white" | "black", name: string) {
        this.position = [row, col];
        this.color = color;
        this.name = name;
        this.hasMoved = false;
    }

    get row(): number {
        return this.position[0];
    }

    get col(): number {
        return this.position[1];
    }

    // Метод для обновления позиции
    setPosition(newRow: number, newCol: number) {
        console.log(`Фигура ${this.name} (${this.color}) передвинута на [${newRow}, ${newCol}]`);
        console.log(`Ранее ходила? ${this.hasMoved}`);
        
        // ❗ Важно: сначала сохраняем старые координаты
        let oldRow = this.position[0];
        let oldCol = this.position[1];

        this.position = [newRow, newCol];

         // ✅ Проверяем, реально ли фигура сменила координаты
        if (oldRow !== newRow || oldCol !== newCol) {
            this.hasMoved = true;
        }
    
        // ❗ Проверка: не меняем `hasMoved` просто так
        if (this.row !== newRow || this.col !== newCol) {
            this.hasMoved = true;
        }
    
        console.log(`Теперь hasMoved: ${this.hasMoved}`);
    }
    abstract getAvailableMoves(board: BoardGrid): [number, number][];
}    

// Пешка (Pawn)
export class Pawn extends Piece {
    getAvailableMoves(board: BoardGrid): [number, number][] {
        let moves: [number, number][] = [];
        let direction = this.color === "white" ? -1 : 1;
        let newRow = this.row + direction;

        if (board[newRow]?.[this.col] === null) {
            moves.push([newRow, this.col]);

            // Двойной ход пешки
            if ((this.color === "white" && this.row === 6) || (this.color === "black" && this.row === 1)) {
                let twoStepsRow = this.row + direction * 2;
                if (board[twoStepsRow]?.[this.col] === null) {
                    moves.push([twoStepsRow, this.col]);
                }
            }
        }
        // ✅ Проверяем взятие по диагонали
        let captureLeft = board[newRow]?.[this.col - 1];
        let captureRight = board[newRow]?.[this.col + 1];

        if (captureLeft && captureLeft.color !== this.color) {
            moves.push([newRow, this.col - 1]); // Бьём фигуру слева
        }

        if (captureRight && captureRight.color !== this.color) {
            moves.push([newRow, this.col + 1]); // Бьём фигуру справа
        }

        return moves;
    }
}

// Ладья (Rook)
export class Rook extends Piece {
    getAvailableMoves(board: BoardGrid): [number, number][] {
        let moves: [number, number][] = [];
        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Вверх, вниз, влево, вправо

        for (let [dx, dy] of directions) {
            let r = this.row + dx, c = this.col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) { // Проверяем, не вышли ли за границы
                if (board[r][c] === null) { 
                    moves.push([r, c]); // ✅ Пустая клетка — можно двигаться дальше
                } else {
                    // ✅ Если встретили вражескую фигуру — можем её взять
                    if (board[r][c]?.color !== this.color) {
                        moves.push([r, c]);
                    }
                    break; // ⛔ Упёрлись в фигуру — дальше не можем идти
                }

                r += dx;
                c += dy;
            }
        }

        return moves;
    }
}

// Конь (Knight)
export class Knight extends Piece {
    getAvailableMoves(board: BoardGrid): [number, number][] {
        let moves: [number, number][] = [];
        let jumps = [
            [-2, -1], [-2, 1], [2, -1], [2, 1], // Вертикальные прыжки
            [-1, -2], [-1, 2], [1, -2], [1, 2]  // Горизонтальные прыжки
        ];

        for (let [dx, dy] of jumps) {
            let r = this.row + dx, c = this.col + dy;

            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === null || board[r][c]?.color !== this.color) {
                    moves.push([r, c]); // ✅ Если клетка пустая или вражеская — можно туда пойти
                }
            }
        }

        return moves;
    }
}


// Слон (Bishop)
export class Bishop extends Piece {
    getAvailableMoves(board: BoardGrid): [number, number][] {
        let moves: [number, number][] = [];
        let directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // Диагонали

        for (let [dx, dy] of directions) {
            let r = this.row + dx, c = this.col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === null) {
                    moves.push([r, c]);
                } else {
                    if (board[r][c]?.color !== this.color) {
                        moves.push([r, c]); // ✅ Если это вражеская фигура — можем её взять
                    }
                    break; // ⛔ Упёрлись в фигуру
                }

                r += dx;
                c += dy;
            }
        }
        return moves;
    }
}


// Ферзь (Queen)
export class Queen extends Piece {
    getAvailableMoves(board: BoardGrid): [number, number][] {
        let moves: [number, number][] = [];
        let directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],  // Ладья (горизонталь, вертикаль)
            [-1, -1], [-1, 1], [1, -1], [1, 1] // Слон (диагонали)
        ];

        for (let [dx, dy] of directions) {
            let r = this.row + dx, c = this.col + dy;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === null) {
                    moves.push([r, c]);
                } else {
                    if (board[r][c]?.color !== this.color) {
                        moves.push([r, c]); // ✅ Если это вражеская фигура — можем её взять
                    }
                    break; // ⛔ Упёрлись в фигуру
                }

                r += dx;
                c += dy;
            }
        }
        return moves;
    }
}


// Король (King)
// Король (King)
export class King extends Piece {
    getAvailableMoves(board: BoardGrid): [number, number][] {
        let moves: [number, number][] = [];
        let directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],  // Горизонталь, вертикаль
            [-1, -1], [-1, 1], [1, -1], [1, 1] // Диагонали
        ];

        for (let [dx, dy] of directions) {
            let r = this.row + dx, c = this.col + dy;

            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === null || board[r][c]?.color !== this.color) {
                    moves.push([r, c]); // ✅ Обычные ходы короля
                }
            }
        }

        // ✅ Проверяем возможность рокировки
        if (!this.hasMoved) {
            let backRank = this.color === "white" ? 7 : 0;
            let rooks = [0, 7]; // Колонки ладей

            for (let col of rooks) {
                let rook = board[backRank][col];
                if (rook && rook.name === "Rook" && !rook.hasMoved) {
                    let direction = col === 0 ? -1 : 1;
                    let pathClear = true;

                    for (let i = this.col + direction; i !== col; i += direction) {
                        if (board[backRank][i]) {
                            pathClear = false;
                            break;
                        }
                    }

                    if (pathClear) {
                        moves.push([backRank, this.col + 2 * direction]); // Добавляем рокировку
                    }
                }
            }
        }

        return moves;
    }
}


