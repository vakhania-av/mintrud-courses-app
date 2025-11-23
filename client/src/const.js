export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_URL = `${API_BASE_URL}/server/api`;

export const ActionTypes = {
  SetCourses: "SET_COURSES",
  ToggleCourse: "TOGGLE_COURSE",
  AddToCombination: "ADD_TO_COMBINATION",
  RemoveFromCombination: "REMOVE_FROM_COMBINATION",
  SetCombinationName: "SET_COMBINATION_NAME",
  SaveCombination: "SAVE_COMBINATION",
  SetCombinations: "SET_COMBINATIONS",
  DeleteCombination: "DELETE_COMBINATION",
  SetLoading: "SET_LOADING",
  SetError: "SET_ERROR",
  ClearMessage: "CLEAR_MESSAGE",
};

// Функция-хэлпер для обработки запроса к API
const handleResponse = async () => {
  if (!response.ok) {
    let errorData = {};

    try {
      errorData = await response.json(); // Если сервер возвращает JSON с ошибкой

      throw errorData;
    } catch (err) {
      throw new Error(errorData.error);
    }
  }

  return response.json();
};

export default async function sendRequest(method, endpoint, body = null) {
  const headers = new Headers();
  const options = {
    method,
    credentials: "include",
    headers,
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  let response = await fetch(endpoint, options);

  return handleResponse(response);
}
