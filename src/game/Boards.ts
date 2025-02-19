import {Piece, Pawn, BoardGrid, Rook, Knight, Bishop, Queen, King } from "./pieces.ts";
import { movePiece } from "./moveLogic.ts";

export class Board {
    size: number;
    grid: BoardGrid;
    currentTurn: "white" | "black" = "white";
    capturedPieces: Piece[] = []; // ✅ Храним битые фигуры

    
    
    constructor() {
        this.size = 8;
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
        this.setupPieces();
        
        console.log("🛠 Итоговая доска после создания:", this.grid);
    }
    
    private setupPieces(): void {
        const backRow = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
        
        for (let i = 0; i < 8; i++) {
            this.grid[6][i] = new Pawn(6, i, "white", "Pawn"); // ✅ Убрали "Pawn", оно уже в классе Pawn
            this.grid[1][i] = new Pawn(1, i, "black", "Pawn");
            
            // ✅ Теперь передаем класс без `name`
            this.grid[7][i] = new backRow[i](7, i, "white", backRow[i].name);
            this.grid[0][i] = new backRow[i](0, i, "black", backRow[i].name);

        }
    }
    
   

    makeMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
        const success = movePiece(this, fromRow, fromCol, toRow, toCol);
        if (success) this.switchTurn();
        return success;
    }
    
    switchTurn() {
        this.currentTurn = this.currentTurn === "white" ? "black" : "white";
    }

    display() {
        console.log(
            this.grid
                .map(row =>
                    row
                        .map(cell => (cell ? cell.name[0] + (cell.color === "white" ? "w" : "b") : "."))
                        .join(" | ")
                )
                .join("\n")
        );
    }
}

export default Board;
