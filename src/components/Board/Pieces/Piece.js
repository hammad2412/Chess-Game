import { useAppContext } from "../../../Context/Context";
import arbiter from "../../../arbiter/arbiter";
import {
  clearCandidates,
  generateCandidateMoves,
} from "../../../reducer/actions/move";
import "./Pieces.css";

const Piece = ({ rank, file, piece }) => {
  const { appState, dispatch } = useAppContext();
  const { turn, position, castleDirection } = appState;
  const currentPosition = position[position.length - 1];
  const prevPosition =
    position.length > 1 ? position[position.length - 2] : null;
  const isSelected =
    appState.selectedPiece &&
    appState.selectedPiece.rank === rank &&
    appState.selectedPiece.file === file;

  const onDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
    if (turn === piece[0]) {
      const candidateMoves = arbiter.getValidMoves({
        position: currentPosition,
        prevPosition,
        castleDirection: castleDirection[turn],
        piece,
        rank,
        file,
      });
      dispatch({
        type: "SELECT_PIECE",
        payload: { piece, rank, file },
      });
      dispatch(generateCandidateMoves(candidateMoves));
    }
  };
  const onDragEnd = (e) => (e.target.style.display = "block");

  //Click to generate move
  const onClick = () => {
    if (turn !== piece[0]) return;

    // if clicking same piece again -> deselect
    if (
      appState.selectedPiece &&
      appState.selectedPiece.rank === rank &&
      appState.selectedPiece.file === file
    ) {
      dispatch(clearCandidates());
      dispatch({ type: "SELECT_PIECE", payload: null });
      return;
    }

    //normal select
    dispatch(clearCandidates());

    const fakeEvent = {
      dataTransfer: {
        setData: () => {},
        effectAllowed: "move",
      },
      target: {
        style: { display: "block" },
      },
    };
    onDragStart(fakeEvent);
  };

  return (
    <div
      className={`piece ${piece} p-${file}${rank} ${
        isSelected ? "selected" : ""
      }`}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      //Mobile Support
      onTouchStart={(e) => {
        e.preventDefault();
        onClick();
      }}
    />
  );
};

export default Piece;
