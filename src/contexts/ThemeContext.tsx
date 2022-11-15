import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggle: () => void;
}>({
  isDarkMode: true,
  toggle: () => {},
});

export const ThemeProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // window object is only available on the client
  const [prefersDarkMode] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  // Persist user choice in localStorage
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    `${process.env.NEXT_PUBLIC_APP_NAME}:dark-mode-enabled`,
    prefersDarkMode ?? false
  );

  useEffect(() => {
    const className = "light-theme";
    const element = window.document.body;

    if (!isDarkMode) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }, [isDarkMode]);

  const toggle = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
