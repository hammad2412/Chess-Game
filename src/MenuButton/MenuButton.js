import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../Context/Context";
import { setupNewGame } from "../reducer/actions/game";
import "./MenuButton.css";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const { changeTheme, themes, dispatch, appState } = useAppContext();
  const menuRef = useRef(null);
  const gameStarted = appState.position.length > 1;

  const handleNewGame = () => {
    const confirmGame = window.confirm(
      "Are you sure you want to start a new game?"
    );

    if (confirmGame) {
      dispatch(setupNewGame());
    }

    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-wrapper" ref={menuRef}>
      <button className="dot-btn" onClick={() => setOpen(!open)}>
        ⋮
      </button>

      {open && (
        <div className="menu-box">
          <div className="menu-title">THEMES</div>

          <div className="themes-btn">
            <button
              className="btn-default"
              onClick={() => changeTheme(themes.default)}
            >
              Default
            </button>
            <button
              className="btn-blue"
              onClick={() => changeTheme(themes.blue)}
            >
              Blue
            </button>
            <button
              className="btn-green"
              onClick={() => changeTheme(themes.green)}
            >
              Green
            </button>
            <button
              className="btn-pink"
              onClick={() => changeTheme(themes.pink)}
            >
              Pink
            </button>
            <button
              className="btn-grey"
              onClick={() => changeTheme(themes.grey)}
            >
              Grey
            </button>
            <button
              className="btn-golden"
              onClick={() => changeTheme(themes.golden)}
            >
              Golden
            </button>
          </div>

          <div
            className={`new-game ${!gameStarted ? "disabled" : ""}`}
            onClick={gameStarted ? handleNewGame : null}
            title={!gameStarted ? "Make a move first" : ""}
          >
            NEW GAME
            {!gameStarted && <span className="tooltip">Make a move first</span>}
          </div>
        </div>
      )}
    </div>
  );
}
