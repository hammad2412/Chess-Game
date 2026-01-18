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
  const isMobile = "ontouchstart" in window;

  const selectPiece = () => {
    if (turn !== piece[0]) return;

    //deselect if click on same piece
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
  };

  const onDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);

    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);

    selectPiece(); // Call logic
  };

  const onDragEnd = (e) => (e.target.style.display = "block");

  return (
    <div
      className={`piece ${piece} p-${file}${rank} ${
        isSelected ? "selected" : ""
      }`}
      draggable={!isMobile}
      onDragStart={!isMobile ? onDragStart : undefined}
      onDragEnd={!isMobile ? onDragEnd : undefined}
      onClick={!isMobile ? selectPiece : undefined}
      //Mobile Support
      onTouchStart={isMobile ? selectPiece : undefined}
    />
  );
};

export default Piece;
