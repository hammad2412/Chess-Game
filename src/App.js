import { useReducer } from "react";
import "./App.css";
import Board from "./components/Board/Board";
import AppContext from "./Context/Context";
import { reducer } from "./reducer/reducer";
import { initGameState } from "./constants";
import Control from "./components/Board/Control/Control";
import MoveList from "./components/Board/Control/bits/MoveList";
import TakeBack from "./components/Board/Control/bits/TakeBack";

function App() {
  const [appState, dispatch] = useReducer(reducer, initGameState);

  const provideState = {
    appState,
    dispatch,
  };
  return (
    <AppContext.Provider value={provideState}>
      <div className="App">
        <Board />
        <Control>
          <MoveList />
          <TakeBack />
        </Control>
      </div>
    </AppContext.Provider>
  );
}

export default App;
