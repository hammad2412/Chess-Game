import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Board from "./components/Board/Board";
import Control from "./components/Board/Control/Control";
import MoveList from "./components/Board/Control/bits/MoveList";
import TakeBack from "./components/Board/Control/bits/TakeBack";
import Menu from "./MenuButton/MenuButton";
import { useAppContext } from "./Context/Context";

function App() {
  const { theme } = useAppContext();
  return (
    <BrowserRouter basename="/Chess-Game">
      {/* */}
      <Routes>
        <Route
          path="/"
          element={
            <div className={`App ${theme}`}>
              <Menu />
              <Board />
              <Control>
                <TakeBack />
                <MoveList />
              </Control>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
