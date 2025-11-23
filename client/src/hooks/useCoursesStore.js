import sendRequest, { ActionTypes, API_URL } from "../const";
import { useCoursesContext } from "../context/CoursesContext";

export default function useCoursesStore() {
  const { state, dispatch } = useCoursesContext();

  //   Загрузка курсов
  const fetchCourses = async () => {
    dispatch({ type: ActionTypes.SetLoading });

    try {
      const { courses } = await sendRequest("GET", `${API_URL}/courses.php`);

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
      const { combinations } = await sendRequest(
        "GET",
        `${API_URL}/combinations.php`
      );

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
      const { combination } = await sendRequest(
        "POST",
        `${API_URL}/combinations.php`,
        {
          name: state.currentCombination.name,
          courses: state.currentCombination.courses,
        }
      );

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
      await fetchCombinations();
    } catch (err) {
      console.error("Ошибка при удалении комбинации:", err);
      dispatch({
        type: ActionTypes.SetError,
        payload: "Ошибка при удалении комбинации",
      });
    }
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
    clearMessage,
    dispatch,
  };
}
