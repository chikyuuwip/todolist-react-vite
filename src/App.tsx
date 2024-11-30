import "./App.css";
import TodoCard from "./components/TodoCard/TodoCard";
import Box from "@mui/material/Box";

function App() {
  return (
    <>
      <Box sx={{ width: 400, height: 500 }}>
        <TodoCard></TodoCard>
      </Box>
    </>
  );
}

export default App;
