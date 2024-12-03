import React, { useReducer } from "react";
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
import Filters from "../Filter/Filters";
import { AnchorEl, Filter, TodoModel } from "../../data/todo";
import { ActionType, initialState, todoReducer } from "../../hooks/reducer";
import "./TodoCard.css";

const TodoCard = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const { todoList, editingTodo, anchorEl, filter } = state;

  const handleFilterChange = (filter: Filter) => {
    dispatch({ type: ActionType.SET_FILTER, payload: filter });
  };

  const createNewTodo = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputElement = event.target as HTMLInputElement;
      const taskName = inputElement.value.trim();

      if (taskName) {
        dispatch({
          type: ActionType.ADD_TODO,
          payload: {
            taskID: new Date().getTime(),
            taskName,
            isSuccessful: false,
          },
        });
        inputElement.value = "";
      }

      console.log(...todoList);
    }
  };

  const clearAllTodo = () => {
    dispatch({ type: ActionType.CLEAR_TODO });
  };

  const updateTodo = (todo: TodoModel) => {
    dispatch({
      type: ActionType.UPDATE_TODO,
      payload: todo,
    });
  };

  const deleteTodo = (todo: TodoModel) => {
    dispatch({ type: ActionType.DELETE_TODO, payload: todo });
    dispatch({ type: ActionType.SET_ANCHOREL, payload: null });
  };

  const SetEditClick = (todo: TodoModel) => {
    dispatch({ type: ActionType.SET_EDITING_TODO, payload: todo });
  };

  const handleEditSubmit = (
    event: React.KeyboardEvent<HTMLDivElement | HTMLInputElement>,
    todo: TodoModel
  ) => {
    if (event.key === "Enter" && editingTodo !== null) {
      updateTodo({ ...todo, taskName: editingTodo.taskName });
      dispatch({ type: ActionType.SET_EDITING_TODO, payload: null });
    }
  };

  const handleEllipsisClick = (anc: AnchorEl) => {
    if (anchorEl?.anchorActiveID === anc.anchorActiveID) {
      dispatch({ type: ActionType.SET_ANCHOREL, payload: null });
    } else {
      dispatch({ type: ActionType.SET_ANCHOREL, payload: anc });
    }
  };

  const filteredTodoList = todoList.filter((todo: TodoModel) => {
    if (filter === Filter.All) return true;
    if (filter === Filter.Pending) return !todo.isSuccessful;
    return todo.isSuccessful;
  });

  const open = Boolean(anchorEl);

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
          <Filters selectedFilter={filter} onChange={handleFilterChange} />
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
        {filteredTodoList.length === 0 && (
          <Typography sx={{ textAlign: "left", pt: 2 }} id="empty-task-message">
            You don't have any task here
          </Typography>
        )}
        {filteredTodoList.map((todo, index) => (
          <Box
            key={todo.taskID}
            sx={{
              display: "flex",
              px: 0,
              py: 1,
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: index > 0 ? "1px solid #B0B0B0" : "",
            }}
            id={`todo-item-${todo.taskID}`}
          >
            <Box
              sx={{
                display: "flex",
                textAlign: "left",
                alignItems: "center",
              }}
              onClick={() =>
                updateTodo({ ...todo, isSuccessful: !todo.isSuccessful })
              }
              id={`todo-checkbox-${todo.taskID}`}
            >
              <Checkbox
                size="small"
                color="error"
                sx={{ pl: 0 }}
                checked={todo.isSuccessful}
                id={`todo-checkbox-input-${todo.taskID}`}
                disabled={editingTodo?.taskID === todo.taskID}
              />
              {editingTodo?.taskID === todo.taskID ? (
                <TextField
                  value={editingTodo.taskName || ""}
                  color="error"
                  onChange={(e) => {
                    const updatedTodo = { ...todo, taskName: e.target.value };
                    SetEditClick(updatedTodo);
                  }}
                  onKeyUp={(event) => handleEditSubmit(event, todo)}
                  autoFocus
                  id={`edit-todo-text-${todo.taskID}`}
                />
              ) : (
                <Typography
                  sx={{
                    textDecoration: todo.isSuccessful ? "line-through" : "none",
                    userSelect: "none",
                    textOverflow: "ellipsis",
                  }}
                  id={`todo-text-${todo.taskID}`}
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
              onClick={(event) => {
                const anchor: AnchorEl = {
                  anchorEl: event.currentTarget,
                  anchorActiveID: todo.taskID,
                };
                handleEllipsisClick(anchor);
              }}
              id={`more-icon-${todo.taskID}`}
            />
            {anchorEl?.anchorActiveID === todo.taskID && (
              <Popper
                id={`todo-popper-${todo.taskID}`}
                open={open}
                anchorEl={anchorEl.anchorEl}
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
                  id={`edit-delete-box-${todo.taskID}`}
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
                    onClick={() => SetEditClick(todo)}
                    id={`edit-box-${todo.taskID}`}
                  >
                    <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography id={`edit-text-${todo.taskID}`}>
                      Edit
                    </Typography>
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
                    onClick={() => deleteTodo(todo)}
                    id={`delete-box-${todo.taskID}`}
                  >
                    <DeleteOutlineOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography id={`delete-text-${todo.taskID}`}>
                      Delete
                    </Typography>
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

export default TodoCard;
