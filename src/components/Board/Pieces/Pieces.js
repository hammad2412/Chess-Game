import "./Pieces.css";
import Piece from "./Piece";
import arbiter from "../../../arbiter/arbiter";
import { useRef } from "react";
import { useAppContext } from "../../../Context/Context";
import { clearCandidates, makeNewMove } from "../../../reducer/actions/move";
import { openPromotion } from "../../../reducer/actions/popup";
import { getCastleDirection } from "../../../arbiter/getMoves";
import {
  detectCheckMate,
  detectInsufficientMaterial,
  detectStalemate,
  updateCastling,
} from "../../../reducer/actions/game";
import { getNewMoveNotation } from "../../../helper";

const Pieces = () => {
  const ref = useRef();
  const { appState, dispatch } = useAppContext();
  const currentPosition = appState.position[appState.position.length - 1];

  const calculateCoords = (e) => {
    const { width, left, top } = ref.current.getBoundingClientRect();
    const size = width / 8;
    const y = Math.floor((e.clientX - left) / size);
    const x = 7 - Math.floor((e.clientY - top) / size);
    return { x, y };
  };

  const openPromotionBox = ({ rank, file, x, y }) =>
    dispatch(openPromotion({ rank: Number(rank), file: Number(file), x, y }));

  const updateCastlingState = ({ piece, rank, file }) => {
    const direction = getCastleDirection({
      castleDirection: appState.castleDirection,
      piece,
      rank,
      file,
    });
    if (direction) {
      dispatch(updateCastling(direction));
    }
  };

  const move = (e) => {
    const { x, y } = calculateCoords(e);
    const [piece, rank, file] = e.dataTransfer.getData("text").split(",");

    if (appState.candidateMoves?.find((m) => m[0] === x && m[1] === y)) {
      const opponent = piece.startsWith("b") ? "w" : "b";
      const castleDirection =
        appState.castleDirection[`${piece.startsWith("b") ? "w" : "b"}`];
      if ((piece === "wp" && x === 7) || (piece === "bp" && x === 0)) {
        openPromotionBox({ rank, file, x, y });
        return;
      }

      if (piece.endsWith("r") || piece.endsWith("k")) {
        updateCastlingState({ piece, rank, file });
      }

      const newPosition = arbiter.performMove({
        position: currentPosition,
        piece,
        rank,
        file,
        x,
        y,
      });

      const newMove = getNewMoveNotation({
        piece,
        rank,
        file,
        x,
        y,
        position: currentPosition,
      });
      // console.log(newMove);

      dispatch(makeNewMove({ newPosition, newMove }));
      dispatch({ type: "SELECT_PIECE", payload: null });

      if (arbiter.insufficientMaterial(newPosition))
        dispatch(detectInsufficientMaterial());
      else if (arbiter.isStalemate(newPosition, opponent, castleDirection))
        dispatch(detectStalemate());
      else if (arbiter.isCheckMate(newPosition, opponent, castleDirection))
        dispatch(detectCheckMate(piece[0]));
    }
    dispatch(clearCandidates());
  };

  const onDrop = (e) => {
    e.preventDefault();
    move(e);
  };

  const onDragOver = (e) => e.preventDefault();

  // click on a square to move piece
  const handleBoardClick = (e) => {
    if (!appState.selectedPiece) return;

    const { x, y } = calculateCoords(e);

    const isValidMove = appState.candidateMoves?.some(
      (m) => m[0] === x && m[1] === y
    );

    // if clicked non-highlight square -> deselect
    if (!isValidMove) {
      dispatch(clearCandidates());
      dispatch({ type: "SELECT_PIECE", payload: null });
      return;
    }

    // else move
    const { piece, rank, file } = appState.selectedPiece;

    const fakeEvent = {
      clientX: e.clientX,
      clientY: e.clientY,
      dataTransfer: {
        getData: () => `${piece},${rank},${file}`,
      },
    };

    move(fakeEvent);
  };

  return (
    <div
      ref={ref}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={handleBoardClick}
      className="pieces"
      // //Mobile Support
      // onTouchStart={(e) => {
      //   e.preventDefault();
      //   handleBoardClick(e?.touches[0]);
      // }}
    >
      {currentPosition.map((r, rank) =>
        r.map((f, file) =>
          currentPosition[rank][file] ? (
            <Piece
              key={rank + "=" + file}
              file={file}
              rank={rank}
              piece={currentPosition[rank][file]}
            />
          ) : null
        )
      )}
    </div>
  );
};
export default Pieces;
