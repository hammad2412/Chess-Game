import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { reducer } from "../reducer/reducer";
import { initGameState } from "../constants";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  /* GAME STATE */
  const [appState, dispatch] = useReducer(reducer, initGameState);

  /* THEMES */
  const themes = {
    default: "theme-default",
    blue: "theme-blue",
    green: "theme-green",
    pink: "theme-pink",
    grey: "theme-grey",
    golden: "theme-golden",
  };

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || themes.default
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        dispatch,
        theme,
        themes,
        changeTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
