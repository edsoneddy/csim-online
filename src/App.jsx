import "./App.css";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import AppContainer from "./components/AppContainer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <AppContainer />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
