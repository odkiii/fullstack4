// Добавьте в начало файла импорт констант
import {
  SET_LOADING,
  SET_ERROR,
  FETCH_TODOS,
  ADD_TODO,
  EDIT_TODO,
  DELETE_TODO
} from './actions'; // Убедитесь, что путь правильный

const initialState = {
  todos: [],
  isLoading: false,
  error: null
};

export default function todoReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case FETCH_TODOS:
      return {
        ...state,
        todos: action.payload,
        error: null
      };
      
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
        error: null
      };
      
    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id ? action.payload : todo
        ),
        error: null
      };
      
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        error: null
      };
      
    default:
      return state;
  }
}