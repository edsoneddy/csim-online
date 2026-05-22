import "./App.css";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";
import AppContainer from "./components/AppContainer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <AppContainer />
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
