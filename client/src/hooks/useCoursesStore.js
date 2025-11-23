import sendRequest, { ActionTypes, API_URL } from "../const";
import { useCoursesContext } from "../context/CoursesContext";

export default function useCoursesStore() {
  const { state, dispatch } = useCoursesContext();

  //   Загрузка курсов
  const fetchCourses = async () => {
    dispatch({ type: ActionTypes.SetLoading });

    try {
      const response = await sendRequest("GET", `${API_URL}/courses.php`);
      // Предполагаем, что API возвращает { courses: [...] } или просто массив
      const courses = response.courses || response;

      dispatch({ type: ActionTypes.SetCourses, payload: courses });
    } catch (err) {
      console.error("Ошибка при загрузке курсов:", err);
      dispatch({
        type: ActionTypes.SetError,
        payload: "Ошибка при загрузке курсов",
      });
    }
  };

  // Загрузка комбинаций
  const fetchCombinations = async () => {
    try {
      const response = await sendRequest("GET", `${API_URL}/combinations.php`);
      // Предполагаем, что API возвращает { combinations: [...] } или просто массив
      const combinations = response.combinations || response;

      dispatch({ type: ActionTypes.SetCombinations, payload: combinations });
    } catch (err) {
      console.error("Ошибка при загрузке комбинаций:", err);
    }
  };

  // Сохранение комбинации
  const saveCombination = async () => {
    if (!state.currentCombination.name || state.currentCombination.courses.length === 0) {
      dispatch({
        type: ActionTypes.SetError,
        payload: "Введите название и выберите хотя бы один курс",
      });

      return;
    }

    try {
      const response = await sendRequest(
        "POST",
        `${API_URL}/combinations.php`,
        {
          name: state.currentCombination.name,
          courses: state.currentCombination.courses
        }
      );

      // Предполагаем, что API возвращает { combination: {...} }
      const combination = response.combination || response;

      dispatch({ type: ActionTypes.SaveCombination, payload: combination });
      await fetchCombinations();
    } catch (err) {
      console.error("Ошибка при сохранении комбинации:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при сохранении комбинации";

      dispatch({ type: ActionTypes.SetError, payload: errorMessage });
    }
  };

  // Удаление комбинации
  const deleteCombination = async (id) => {
    try {
      await sendRequest("DELETE", `${API_URL}/combinations.php?id=${id}`);

      dispatch({ type: ActionTypes.DeleteCombination, payload: id });
    } catch (err) {
      console.error("Ошибка при удалении комбинации:", err);
      dispatch({
        type: ActionTypes.SetError,
        payload: "Ошибка при удалении комбинации",
      });
    }
  };

  const addToCombination = (courseId) => {
    if (state.currentCombination.courses.length >= 3) {
      dispatch({
        type: ActionTypes.SetError,
        payload: "Можно добавить не более 3 курсов"
      });
      return;
    }
    dispatch({ type: ActionTypes.AddToCombination, payload: courseId });
  };

  const removeFromCombination = (courseId) => {
    dispatch({ type: ActionTypes.RemoveFromCombination, payload: courseId });
  };

  const setCombinationName = (name) => {
    dispatch({ type: ActionTypes.SetCombinationName, payload: name });
  };

  const toggleCourse = (courseId) => {
    dispatch({ type: ActionTypes.ToggleCourse, payload: courseId });
  };

  // Очистка сообщения
  const clearMessage = () => {
    dispatch({ type: ActionTypes.ClearMessage });
  };

  return {
    ...state,
    fetchCourses,
    fetchCombinations,
    saveCombination,
    deleteCombination,
    addToCombination,
    removeFromCombination,
    setCombinationName,
    toggleCourse,
    clearMessage,
    dispatch
  };
}
