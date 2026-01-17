import { useAppContext } from "../../../../Context/Context";
import { takeBack } from "../../../../reducer/actions/move";
import "./TakeBack.css";

const TakeBack = () => {
  const { dispatch } = useAppContext();

  return (
    <div className="take-back">
      <button className="undo" onClick={() => dispatch(takeBack())}>
        Undo
      </button>
    </div>
  );
};

export default TakeBack;
