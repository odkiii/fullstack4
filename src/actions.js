import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

// Типы действий
export const FETCH_TODOS = 'FETCH_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

// Создатели действий
const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

const setError = (error) => ({
  type: SET_ERROR,
  payload: error
});

// Получение задач пользователя
export const fetchTodos = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const q = query(
      collection(db, "todos"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const todos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    dispatch({
      type: FETCH_TODOS,
      payload: todos
    });
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error("Error fetching todos:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Добавление новой задачи
export const addTodo = (todo) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const docRef = await addDoc(collection(db, "todos"), todo);
    const newTodo = {
      id: docRef.id,
      ...todo
    };
    
    dispatch({
      type: ADD_TODO,
      payload: newTodo
    });
    
    return newTodo;
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error("Error adding todo:", error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Редактирование задачи
export const editTodo = (todo) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const todoRef = doc(db, "todos", todo.id);
    await updateDoc(todoRef, {
      text: todo.text,
      status: todo.status,
      dueDate: todo.dueDate,
      reminder: todo.reminder,
      reminderTime: todo.reminderTime,
      reminded: todo.reminded
    });
    
    dispatch({
      type: EDIT_TODO,
      payload: todo
    });
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error("Error editing todo:", error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Удаление задачи
export const deleteTodo = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    await deleteDoc(doc(db, "todos", id));
    
    dispatch({
      type: DELETE_TODO,
      payload: id
    });
    
  } catch (error) {
    dispatch(setError(error.message));
    console.error("Error deleting todo:", error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};