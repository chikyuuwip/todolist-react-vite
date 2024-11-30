import { TodoModel } from "../components/interface";

enum ActionType {
    ADD_TODO = "ADD_TODO",
    TOGGLE_TODO = "TOGGLE_TODO",
    DELETE_TODO = "DELETE_TODO",
    CLEAR_TODO = "CLEAR_ALL",
}

interface AddTodoAction {
    type: ActionType.ADD_TODO;
    payload: TodoModel;
  }
  
  interface ToggleTodoAction {
    type: ActionType.TOGGLE_TODO;
    payload: number; // Index of the todo
  }
  
  interface DeleteTodoAction {
    type: ActionType.DELETE_TODO;
    payload: number; // Index of the todo
  }
  
  interface ClearTodoAction {
    type: ActionType.CLEAR_TODO;
  }
  
  type TodoActions =
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | ClearTodoAction;

  interface TodoState {
    todoList: Readonly<TodoModel[]>;
}

const initialState: TodoState = {
    todoList: [] as Readonly<TodoModel[]>
}


const todoReducer = (state: TodoState, action: TodoActions): TodoState => {
    switch (action.type) {
      case ActionType.ADD_TODO:
        return {
          ...state,
          todoList: [...state.todoList, action.payload],
        };
  
      case ActionType.TOGGLE_TODO:
        return {
          ...state,
          todoList: state.todoList.map((todo: TodoModel, i: number) =>
            i === action.payload
              ? { ...todo, isSuccessful: !todo.isSuccessful }
              : todo
          ),
        };
  
      case ActionType.DELETE_TODO:
        return {
          ...state,
          todoList: state.todoList.filter(
            (_: TodoModel, i: number) => i !== action.payload
          ),
        };
  
      case ActionType.CLEAR_TODO:
        return {
          ...state,
          todoList: [],
        };

      default:
        throw new Error(`Unhandled action type: ${(action as TodoActions).type}`);
    }
  };
  
  export { todoReducer, initialState, ActionType };