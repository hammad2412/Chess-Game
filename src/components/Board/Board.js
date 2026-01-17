import "./Board.css";
import Pieces from "./Pieces/Pieces";
import Files from "./bits/Files";
import Ranks from "./bits/Ranks";
import { useAppContext } from "../../Context/Context";
import Popup from "../../Popup/Popup";
import arbiter from "../../arbiter/arbiter";
import { getKingPosition } from "../../arbiter/getMoves";
import PromotionBox from "../../Popup/PromotionBox";
import GameEnds from "../../Popup/GameEnds";
import { clearCapture } from "../../reducer/actions/move";
import { useEffect } from "react";

const Board = () => {
  const ranks = Array(8)
    .fill()
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((x, i) => i + 1);

  const { appState, dispatch } = useAppContext();
  const { lastMove } = appState;

  //capture
  const { capturedSquare } = appState;

  //reset after capture animation
  useEffect(() => {
    if (capturedSquare) {
      const t = setTimeout(() => {
        dispatch(clearCapture());
      }, 500);

      return () => clearTimeout(t);
    }
  }, [capturedSquare, dispatch]);

  const position = appState.position[appState.position.length - 1];

  const isChecked = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position,
      player: appState.turn,
    });
    if (isInCheck) return getKingPosition(position, appState.turn);
    return null;
  })();

  const getClassName = (i, j) => {
    let c = "tile";
    c += (i + j) % 2 === 0 ? " tile--dark" : " tile--light";

    //candidate move
    if (appState.candidateMoves?.find((m) => m[0] === i && m[1] === j)) {
      if (position[i][j]) c += " attacking";
      else c += " highlight";
    }

    //Last move highlight
    if (
      lastMove?.from &&
      ((lastMove.from.row === i && lastMove.from.col === j) ||
        (lastMove.to.row === i && lastMove.to.col === j))
    ) {
      c += " last-move";
    }

    //capture piece
    if (
      capturedSquare &&
      capturedSquare.row === i &&
      capturedSquare.col === j
    ) {
      c += " capture";
    }

    //check highlight
    if (isChecked && isChecked[0] === i && isChecked[1] === j) c += " checked";
    return c;
  };

  return (
    <div className="board">
      <Ranks ranks={ranks} />

      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div
              key={file + "=" + rank}
              className={getClassName(7 - i, j)}
            ></div>
          ))
        )}
      </div>

      <Pieces />

      <Popup>
        <PromotionBox />
        <GameEnds />
      </Popup>

      <Files files={files} />
    </div>
  );
};
export default Board;
