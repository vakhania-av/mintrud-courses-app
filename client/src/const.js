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

export const DEFAULT_TIMEOUT = 4000;

// Функция-хэлпер для обработки запроса к API
const handleResponse = async (response) => {
  // Проверяем, валиден ли Content-Type
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorData = {};

    try {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json(); // Если сервер возвращает JSON с ошибкой
      }

      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    } catch (err) {
      throw new Error(err.message || "Произошла неизвестная ошибка");
    }
  }

  // Если это успешный ответ
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export default async function sendRequest(
  method,
  endpoint,
  body = null,
  timeout = 30000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = new Headers();

    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    const options = {
      method,
      credentials: "include",
      signal: controller.signal,
      headers,
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);

    clearTimeout(timeoutId);

    return await handleResponse(response);
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new Error(`Таймут запроса превышен после ${timeout} ms`);
    }
  }
}
