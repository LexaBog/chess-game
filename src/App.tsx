import React, { useEffect, useState } from "react";
import Board from "./game/Boards.ts";
import ChessBoard from "./components/ChessBoard.tsx";

const App: React.FC = () => {
  const [board, setBoard] = useState(new Board());
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");

  useEffect(() => {
    const newBoard = new Board();
    setBoard(newBoard);
    console.log("Доска загружена:", newBoard.grid);
  }, []);

  if (!board) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Шахматы 🚀</h1>
      <h2>Ход: {currentTurn === "white" ? "Белые" : "Чёрные"}</h2>
      <ChessBoard 
        board={board} 
        setBoard={setBoard} 
        currentTurn={currentTurn}
        setCurrentTurn={setCurrentTurn}
      />
    </div>
  );
};

export default App;
