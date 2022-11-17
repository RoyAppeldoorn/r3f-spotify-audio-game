import "../src/ui-components/theme.css";
import "../src/globals.css";
import { ThemeProvider } from "../src/application/contexts/ThemeContext";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "dark",
    toolbar: {
      icon: "circlehollow",
      items: ["light", "dark"],
      showName: false,
    },
  },
};

const withThemeProvider = (Story, context) => {
  const theme = context.parameters.theme || context.globals.theme;

  const body = document.getElementsByTagName("body")[0];

  body.classList.remove("light-theme");
  if (theme === "light") {
    body.classList.add("light-theme");
  }

  return (
    <ThemeProvider>
      <Story {...context} />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];
