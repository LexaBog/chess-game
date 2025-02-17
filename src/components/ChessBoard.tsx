import React, { useState, useEffect } from "react";
import { Piece } from "../game/pieces";
import Board from "../game/Boards.ts";
import { handleClick } from "../game/handleClick.ts";
import { isKingInCheck } from "../game/checkLogic.ts";
import PawnPromotion from "./PawnPromotion.tsx";

import "../styles/ChessBoard.css";

interface ChessBoardProps {
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    currentTurn: "white" | "black";
    setCurrentTurn: React.Dispatch<React.SetStateAction<"white" | "black">>;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ board, setBoard, currentTurn, setCurrentTurn }) => {
    const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
    const [availableMoves, setAvailableMoves] = useState<[number, number][]>([]);
    const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
    const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
    const [isCheck, setIsCheck] = useState<"white" | "black" | null>(null);
    const [promotion, setPromotion] = useState<{ row: number, col: number, color: "white" | "black" } | null>(null);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);

    useEffect(() => {
        setCapturedWhite(board.capturedPieces.filter(piece => piece.color === "white"));
        setCapturedBlack(board.capturedPieces.filter(piece => piece.color === "black"));
    }, [board.capturedPieces]); // ✅ Теперь состояние обновляется автоматически
    
    useEffect(() => {
        if (isKingInCheck(board, currentTurn)) {
            console.log(`⚠️ Шах! Король ${currentTurn} под атакой.`);
            setIsCheck(currentTurn);
        } else {
            setIsCheck(null);
        }
    
        // ✅ Проверяем, если короля нет на доске — это мат!
        if (!board.grid.flat().some(p => p?.name === "King")) {
            console.log(`♜ Мат! Победили ${currentTurn === "white" ? "чёрные" : "белые"}!`);
            alert(`♜ Мат! Победили ${currentTurn === "white" ? "чёрные" : "белые" }!`);
            
        }
    }, [board, board.grid, currentTurn]);
  
    const restartGame = () => {
        console.log("🔄 Перезапуск игры...");
        const newBoard = new Board(); 
        setBoard(newBoard); // ✅ Обновляем доску
        setCurrentTurn("white"); // ✅ Белые начинают
    };   
    
    return (
        <>
            {isCheck && (
                <div className="check-warning">
                    ⚠️ Шах! Король {isCheck === "white" ? "белых" : "чёрных"} под атакой!
                </div>
            )}

            <div className="chessboard">
                
                {board.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isSelected =
                            selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex;

                        const isAvailableMove = availableMoves.some(
                            ([r, c]) => r === rowIndex && c === colIndex
                        );

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`cell ${(rowIndex + colIndex) % 2 === 0 ? "light" : "dark"} ${
                                    isSelected ? "selected" : ""
                                }`}
                                onClick={() => handleClick({
                                    row: rowIndex,
                                    col: colIndex,
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
                                })}
                            >
                                {cell ? (
                                    <span className={`piece ${cell.color}`}>{getSymbol(cell)}</span>
                                ) : isAvailableMove ? (
                                    <div className="available-move"></div> // 🔥 Подсветка возможного хода
                                ) : null}
                            </div>
                        );
                    })
                )}
                <div className="captured-container">
                    <div className="captured">
                        <h3>Битые белые</h3>
                        <div className="captured-pieces">
                            {capturedWhite.map((piece, index) => (
                                <span key={index} className="captured-piece">{getSymbol(piece)}</span>
                            ))}
                        </div>
                    </div>

                    <div className="captured">
                        <h3>Битые чёрные</h3>
                        <div className="captured-pieces">
                            {capturedBlack.map((piece, index) => (
                                <span key={index} className="captured-piece">{getSymbol(piece)}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          
            <div className="game-controls">
                <button className="restart-button" onClick={restartGame}>
                    🔄 Перезапустить игру
                </button>
            </div>
            {promotion && <PawnPromotion             
              promotion={promotion}
              setPromotion={setPromotion}
              setBoard={setBoard}
              setCurrentTurn={setCurrentTurn}
              board={board}
            />}
            {warningMessage && (
                <div className="warning-popup">
                    {warningMessage}
                    <button onClick={() => setWarningMessage(null)}>✖</button>
                </div>
            )}
        </>
    );
};

// Функция для получения символа фигуры (Юникод)
const getSymbol = (piece: Piece): string => {
    const symbols: { [key: string]: string } = {
        Pawn: "♟",
        Rook: "♜",
        Knight: "♞",
        Bishop: "♝",
        Queen: "♛",
        King: "♚",
    };
    return symbols[piece.name] || "?";
};

export default ChessBoard;
