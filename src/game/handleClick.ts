import {React} from "react"
import { Board } from "../game/Boards.ts";
import { Piece } from "../game/pieces.ts";
import { movePiece } from "../game/moveLogic.ts";
import { isKingInCheck } from "../game/checkLogic.ts";
import { canCastle, performCastle } from "../game/castlingLogic.ts";

// const [moveCount, setMoveCount] = useState(0);

interface HandleClickParams {
    row: number;
    col: number;
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    currentTurn: "white" | "black";
    setCurrentTurn: React.Dispatch<React.SetStateAction<"white" | "black">>;
    selectedPiece: [number, number] | null;
    setSelectedPiece: React.Dispatch<React.SetStateAction<[number, number] | null>>;
    availableMoves: [number, number][];
    setAvailableMoves: React.Dispatch<React.SetStateAction<[number, number][]>>;
    capturedWhite: Piece[];
    setCapturedWhite: React.Dispatch<React.SetStateAction<Piece[]>>;
    capturedBlack: Piece[];
    setCapturedBlack: React.Dispatch<React.SetStateAction<Piece[]>>;
    setIsCheck: React.Dispatch<React.SetStateAction<"white" | "black" | null>>;
    setPromotion: React.Dispatch<
        React.SetStateAction<{ row: number; col: number; color: "white" | "black" } | null>
    >;
    setWarningMessage: React.Dispatch<React.SetStateAction<string | null>>; 
    setMoveCount: React.Dispatch<React.SetStateAction<number>>;
}

export const handleClick = ({
    row,
    col,
    board,
    setBoard,
    currentTurn,
    setCurrentTurn,
    selectedPiece,
    setSelectedPiece,
    availableMoves,
    setAvailableMoves,
    capturedWhite,
    setCapturedWhite,
    capturedBlack,
    setCapturedBlack,
    setIsCheck,
    setPromotion,
    setWarningMessage,
    // moveCount, 
    setMoveCount,
}: HandleClickParams) => {
    const clickedPiece = board.grid[row][col];
    
    // ✅ Если кликнули по уже выбранной фигуре — отменяем выбор
    if (selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col) {
        console.log("Отмена выбора фигуры");
        setSelectedPiece(null);
        setAvailableMoves([]);
        return;
    }

    // ✅ Если кликнули на другую фигуру того же цвета — просто меняем выбор
    if (selectedPiece && clickedPiece && clickedPiece.color === currentTurn) {
        console.log("🔄 Смена выбранной фигуры");
        setSelectedPiece([row, col]);
        setAvailableMoves(clickedPiece.getAvailableMoves(board.grid) || []);
        return;
    }

    // ✅ Если фигура не выбрана, но выбрана новая фигура игрока
    if (!selectedPiece && clickedPiece && clickedPiece.color === currentTurn) {
        setSelectedPiece([row, col]);
        setAvailableMoves(clickedPiece.getAvailableMoves(board.grid) || []);
        return; // ❗️ Не передаём ход дальше
    }

    // ✅ Если был выбран ход, но он невалидный
    if (selectedPiece && !availableMoves.some(([r, c]) => r === row && c === col)) {
        console.log("⛔️ Нельзя сюда ходить!");
        return;
    }

    // if (!selectedPiece) {
    //     let piece = board.grid[row][col];
    //     if (piece && piece.color === currentTurn) {
    //         setSelectedPiece([row, col]);
    //         setAvailableMoves(piece.getAvailableMoves(board.grid) || []);
    //         return; // ❗️ НЕ передаём ход
    //     }
    // } else {
    //     const [fromRow, fromCol] = selectedPiece;

    //     if (movePiece(board, fromRow, fromCol, row, col)) {
    //         setSelectedPiece(null);
    //         setAvailableMoves([]);
    //         setMoveCount(prev => prev + 1); // ✅ Увеличиваем ход ТОЛЬКО если движение произошло
    //         setCurrentTurn(prev => (prev === "white" ? "black" : "white"));
    //     }
    // }

    // ✅ Проверяем рокировку, если выбрали короля
    if (selectedPiece && board.grid[selectedPiece[0]][selectedPiece[1]]) {
        let king = board.grid[selectedPiece[0]][selectedPiece[1]];
        
        if (king && king.name === "King") {  // ✅ Проверяем, что `king` не null
            console.log("🔍 Проверяем возможность рокировки...");
    
            if (col === 6 || col === 2) {
                if (canCastle(board, king, col)) {  
                    console.log("✅ Рокировка возможна!");
                    performCastle(board, king, col);
                    setSelectedPiece(null);
                    setCurrentTurn(prev => (prev === "white" ? "black" : "white"));
                    return;
                } else {
                    console.log("❌ Рокировка невозможна!");
                }
            }
        }
    }

    if (!selectedPiece) {
        console.log("⚠️ Ошибка: selectedPiece = null, невозможно обработать ход");
        return;
    }
    const [fromRow, fromCol] = selectedPiece;
   if (availableMoves.some(([r, c]) => r === row && c === col)) {
        if (movePiece(board, fromRow, fromCol, row, col)) {
            setSelectedPiece(null);
            setAvailableMoves([]);
            setMoveCount(prev => prev + 1);
            setCurrentTurn(prev => (prev === "white" ? "black" : "white"));
        } else {
            console.log("❌ Нельзя сделать этот ход.");
        }
    }
    
    // ✅ Обрабатываем ход
    // const [fromRow, fromCol] = selectedPiece;
    console.log(`Попытка хода из (${fromRow}, ${fromCol}) в (${row}, ${col})`);

    if (!movePiece(board, fromRow, fromCol, row, col)) {
        console.log("❌ Король остаётся под шахом.");   
        setSelectedPiece(null);
        setAvailableMoves([]);  
        // ✅ Показываем предупреждение пользователю
        // setWarningMessage("🚨 Нельзя сделать этот ход – король попадёт под шах!");  
        // return;
    }
    setSelectedPiece(null);
    setAvailableMoves([]);

   // ✅ Проверяем шах для противника после хода
   const opponentTurn = currentTurn === "white" ? "black" : "white";

   if (isKingInCheck(board, opponentTurn)) {
       console.log(`⚠️ Шах! Король ${opponentTurn} под атакой.`);
       setIsCheck(opponentTurn);
   } else {
       setIsCheck(null);
   }

   if (board.grid[row][col]?.name === "Pawn" && (row === 0 || row === 7)) {
    console.log("♟ Пешка достигла конца доски! Ожидание превращения...");
    setPromotion({ row, col, color: currentTurn });
    return;
    }

   setCurrentTurn(opponentTurn); 
};
