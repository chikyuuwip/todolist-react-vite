import { AnchorEl, Filter, TodoModel } from "../data/todo";

enum ActionType {
  ADD_TODO = "ADD_TODO",
  DELETE_TODO = "DELETE_TODO",
  CLEAR_TODO = "CLEAR_ALL",
  UPDATE_TODO = "UPDATE_TODO",
  SET_EDITING_TODO = "SET_EDITING_TODO",
  SET_ANCHOREL = "SET_ANCHOREL",
  SET_FILTER = "SET_FILTER",
}

type TodoActions =
  | AddTodoAction
  | DeleteTodoAction
  | UpdateTodoAction
  | ClearTodoAction
  | SetEditingTodoAction
  | SetAnchorELAction
  | SetFilterAction;

interface AddTodoAction {
  type: ActionType.ADD_TODO;
  payload: TodoModel;
}

interface DeleteTodoAction {
  type: ActionType.DELETE_TODO;
  payload: TodoModel;
}

interface UpdateTodoAction {
  type: ActionType.UPDATE_TODO;
  payload: TodoModel;
}

interface ClearTodoAction {
  type: ActionType.CLEAR_TODO;
}

interface SetEditingTodoAction {
  type: ActionType.SET_EDITING_TODO;
  payload: TodoModel | null;
}

interface SetAnchorELAction {
  type: ActionType.SET_ANCHOREL;
  payload: AnchorEl | null;
}

interface SetFilterAction {
  type: ActionType.SET_FILTER;
  payload: Filter;
}

interface TodoState {
  todoList: TodoModel[];
  editingTodo: TodoModel | null;
  anchorEl: AnchorEl | null;
  filter: Filter;
}

const initialState: TodoState = {
  todoList: [] as TodoModel[],
  editingTodo: null,
  anchorEl: null,
  filter: Filter.All,
};

const todoReducer = (state: TodoState, action: TodoActions): TodoState => {
  switch (action.type) {
    case ActionType.ADD_TODO:
      return {
        ...state,
        todoList: [...state.todoList, action.payload],
      };

    case ActionType.UPDATE_TODO:
      return {
        ...state,
        todoList: state.todoList.map((todo: TodoModel) =>
          todo.taskID === action.payload.taskID
            ? { ...todo, ...action.payload }
            : todo
        ),
      };

    case ActionType.DELETE_TODO:
      return {
        ...state,
        todoList: state.todoList.filter(
          (todo: TodoModel) => todo.taskID !== action.payload.taskID
        ),
      };

    case ActionType.CLEAR_TODO:
      return {
        ...state,
        todoList: [],
      };

    case ActionType.SET_EDITING_TODO:
      return {
        ...state,
        editingTodo: action.payload,
      };

    case ActionType.SET_ANCHOREL:
      return {
        ...state,
        anchorEl: action.payload,
      };

    case ActionType.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    default:
      throw new Error(`Unhandled action type: ${(action as TodoActions).type}`);
  }
};

export { todoReducer, initialState, ActionType };
