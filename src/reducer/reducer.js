import { Status } from "../constants";
import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_MOVE: {
      let { turn, position, moveList } = state;

      const { newPosition, newMove } = action.payload;

      turn = turn === "w" ? "b" : "w";
      position = [...position, newPosition];

      moveList = [...moveList, newMove];
      return {
        ...state,
        turn,
        moveList,
        position,
        lastMove: {
          from: newMove.from,
          to: newMove.to,
        },
        capturedSquare: newMove.captured ? newMove.to : null,
      };
    }

    case actionTypes.GENERATE_CANDIDATE_MOVES: {
      return {
        ...state,
        candidateMoves: action.payload.candidateMoves,
      };
    }

    case actionTypes.CLEAR_CANDIDATE_MOVES: {
      return {
        ...state,
        candidateMoves: [],
      };
    }

    case actionTypes.PROMOTION_OPEN: {
      return {
        ...state,
        status: Status.promoting,
        promotionSquare: { ...action.payload },
      };
    }

    case actionTypes.PROMOTION_CLOSE: {
      return {
        ...state,
        status: Status.ongoing,
        promotionSquare: null,
      };
    }

    case actionTypes.CAN_CASTLE: {
      let { turn, castleDirection } = state;
      castleDirection[turn] = action.payload;

      return {
        ...state,
        castleDirection,
      };
    }

    case actionTypes.STALEMATE: {
      return {
        ...state,
        status: Status.stalemate,
      };
    }

    case actionTypes.WIN: {
      return {
        ...state,
        status: action.payload === "w" ? Status.white : Status.black,
      };
    }

    case actionTypes.INSUFFICIENT_MATERIAL: {
      return {
        ...state,
        status: Status.insufficient,
      };
    }

    case actionTypes.NEW_GAME: {
      return {
        ...action.payload,
      };
    }

    case actionTypes.SELECT_PIECE: {
      return {
        ...state,
        selectedPiece: action.payload,
      };
    }

    case actionTypes.CLEAR_CAPTURE: {
      return {
        ...state,
        capturedSquare: null,
      };
    }

    case actionTypes.TAKE_BACK: {
      let { position, moveList, turn } = state;

      if (position.length > 1) {
        position = position.slice(0, -1);
        moveList = moveList.slice(0, -1);
        turn = turn === "w" ? "b" : "w";
      }

      const last = moveList[moveList.length - 1];

      return {
        ...state,
        position,
        moveList,
        turn,
        lastMove: last
          ? { from: last.from, to: last.to }
          : { from: null, to: null },
      };
    }

    default:
      return state;
  }
};
