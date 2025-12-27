import { useAppContext } from "../../../../Context/Context";
import "./MoveList.css";

const MoveList = () => {
  const {
    appState: { moveList },
  } = useAppContext();

  return (
    <div className="move-list">
      {moveList.map((move, i) => (
        <div key={i} data-number={Math.floor(i / 2 + 1)}>
          {move}
        </div>
      ))}
    </div>
  );
};

export default MoveList;
