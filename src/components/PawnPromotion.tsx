import React from "react";
import { promotePawn } from "../game/pawnPromotionLogic.ts";
import { Board } from "../game/Boards";

interface PromotionData {
    row: number;
    col: number;
    color: "white" | "black";
}

interface Props {
    promotion: PromotionData;
    setPromotion: React.Dispatch<React.SetStateAction<null>>;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    setCurrentTurn: React.Dispatch<React.SetStateAction<"white" | "black">>;
    board: Board;
}

const PawnPromotion: React.FC<Props> = ({ promotion, setPromotion, setBoard, setCurrentTurn, board }) => {
    const handlePromotion = (pieceType: "Queen" | "Rook" | "Bishop" | "Knight") => {
        promotePawn(board, promotion, pieceType, setPromotion, setBoard, setCurrentTurn);
    };

    return (
        <div className="promotion-modal">
            <h3>Выберите фигуру для превращения</h3>
            <button onClick={() => handlePromotion("Queen")}>♛</button>
            <button onClick={() => handlePromotion("Rook")}>♜</button>
            <button onClick={() => handlePromotion("Bishop")}>♝</button>
            <button onClick={() => handlePromotion("Knight")}>♞</button>
        </div>
    );
};

export default PawnPromotion;
