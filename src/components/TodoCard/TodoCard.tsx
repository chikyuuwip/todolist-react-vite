import React, { useReducer, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  InputAdornment,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./TodoCard.css";
import Filters from "../Filter/Filters";
import { Filter } from "../interface";
import { ActionType, initialState, todoReducer } from "../../store/reducer";

const Todo = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const [selectedFilter, setSelectedFilter] = useState(Filter.All);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { todoList } = state;

  const handleFilterChange = (filter: Filter) => {
    setSelectedFilter(filter);
  };

  const createNewTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputElement = event.target as HTMLInputElement;
      const taskName = inputElement.value.trim();

      if (taskName) {
        dispatch({
          type: ActionType.ADD_TODO,
          payload: { taskName, isSuccessful: false },
        });
        inputElement.value = "";
      }
    }
  };

  const updateStatus = (index: number) => {
    if (editingIndex == index) {
      return;
    }
    dispatch({
      type: ActionType.TOGGLE_TODO,
      payload: index,
    });
  };

  const deleteTodo = (index: number) => {
    dispatch({ type: ActionType.DELETE_TODO, payload: index });
    setAnchorEl(null);
    setActiveIndex(null);
  };

  const clearAllTodo = () => {
    setAnchorEl(null);
    setActiveIndex(null);
    dispatch({ type: ActionType.CLEAR_TODO });
  };

  const handleEllipsisClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    if (anchorEl && activeIndex === index) {
      setAnchorEl(null);
      setActiveIndex(null);
    } else {
      setAnchorEl(event.currentTarget);
      setActiveIndex(index);
    }
  };

  const open = Boolean(anchorEl && activeIndex !== null);

  const handleEditClick = (index: number) => {
    setEditingTask(todoList[index].taskName);
    setEditingIndex(index);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTask(event.target.value);
  };

  const handleEditSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      editingTask !== null &&
      editingIndex !== null
    ) {
      setTodoList((prevItems) =>
        prevItems.map((todo, i) =>
          i === editingIndex ? { ...todo, taskName: editingTask } : todo
        )
      );
      setEditingTask(null);
      setEditingIndex(null);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        maxHeight: 500,
        color: "black",
        px: 4,
        pt: 4,
        pb: todoList.length > 0 ? 2 : 3,
        borderRadius: "7px",
      }}
      id="todo-card"
    >
      <Box id="todo-input-box">
        <TextField
          placeholder="Add a New Task + Enter"
          color="error"
          onKeyUp={createNewTodo}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <StickyNote2OutlinedIcon />
                </InputAdornment>
              ),
            },
          }}
          fullWidth
          id="todo-input"
        />
      </Box>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          m: 0,
          my: 1,
          px: 0,
        }}
        id="todo-actions"
      >
        <Box sx={{ display: "flex", flexDirection: "row" }} id="filter-box">
          <Filters
            selectedFilter={selectedFilter}
            onChange={handleFilterChange}
          />
        </Box>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            clearAllTodo();
          }}
          id="clear-all-button"
        >
          Clear All
        </Button>
      </CardActions>
      <Box
        sx={{ borderBottom: "1px solid #B0B0B0", mx: -4 }}
        id="border-line"
      ></Box>
      <CardContent
        sx={{ p: 0, "&:last-child": { p: 0 } }}
        id="todo-list-content"
      >
        {todoList.length === 0 && (
          <Typography sx={{ textAlign: "left", pt: 2 }} id="empty-task-message">
            You don't have any task here
          </Typography>
        )}
        {todoList.map((todo, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              px: 0,
              py: 1,
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: index > 0 ? "1px solid #B0B0B0" : "",
            }}
            id={`todo-item-${index}`}
          >
            <Box
              sx={{
                display: "flex",
                textAlign: "left",
                alignItems: "center",
              }}
              onClick={() => updateStatus(index)}
              id={`todo-checkbox-${index}`}
            >
              <Checkbox
                size="small"
                color="error"
                sx={{ pl: 0 }}
                checked={todo.isSuccessful}
                id={`todo-checkbox-input-${index}`}
                disabled={editingIndex === index}
              />
              {editingIndex === index ? (
                <TextField
                  value={editingTask || ""}
                  color="error"
                  onChange={handleEditChange}
                  onKeyUp={handleEditSubmit}
                  autoFocus
                  id={`edit-todo-text-${index}`}
                />
              ) : (
                <Typography
                  sx={{
                    textDecoration: todo.isSuccessful ? "line-through" : "none",
                    userSelect: "none",
                    textOverflow: "ellipsis",
                  }}
                  id={`todo-text-${index}`}
                >
                  {todo.taskName.length < 25
                    ? todo.taskName
                    : todo.taskName.substring(0, 25) + "..."}
                </Typography>
              )}
            </Box>
            <MoreHorizIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={(event) => handleEllipsisClick(event, index)}
              id={`more-icon-${index}`}
            />
            {activeIndex === index && (
              <Popper
                id={`todo-popper-${index}`} // added id to popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    color: "black",
                    p: 1,
                    borderRadius: "5px",
                    boxShadow: 2,
                  }}
                  id={`edit-delete-box-${index}`}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 0.5,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#E8E8E8",
                      },
                    }}
                    onClick={() => handleEditClick(index)}
                    id={`edit-box-${index}`}
                  >
                    <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography id={`edit-text-${index}`}>Edit</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 0.5,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#E8E8E8",
                      },
                    }}
                    onClick={() => deleteTodo(index)}
                    id={`delete-box-${index}`}
                  >
                    <DeleteOutlineOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography id={`delete-text-${index}`}>Delete</Typography>
                  </Box>
                </Box>
              </Popper>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default Todo;
