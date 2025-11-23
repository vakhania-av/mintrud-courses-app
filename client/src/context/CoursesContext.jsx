import { createContext, useReducer } from "react";
import { ActionTypes } from "../const";

export const CoursesContext = createContext();

// Инициализируем начальный store
const initialState = {
  courses: [],
  selectedCourses: [],
  combinations: [],
  currentCombination: {
    name: "",
    courses: [],
  },
  loading: false,
  error: null,
  successMessage: "",
};

// Формируем функцию-редьюсер (по типу Redux Toolkit)
function coursesReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SetCourses:
      return {
        ...state,
        courses: action.payload,
        loading: false,
      };

    case ActionTypes.ToggleCourse:
      const courseId = action.payload;
      const isSelected = state.selectedCourses.some(
        (currentCourse) => currentCourse.id === courseId
      );

      if (isSelected) {
        return {
          ...state,
          selectedCourses: state.selectedCourses.filter(
            (currentCourse) => currentCourse.id !== courseId
          ),
        };
      }

      const course = state.courses.find(
        (currentCourse) => currentCourse.id === courseId
      );

      return {
        ...state,
        selectedCourses: [...state.selectedCourses, course],
      };

    case ActionTypes.AddToCombination:
      if (state.currentCombination.courses.length >= 3) {
        return state;
      }

      const courseToAdd = state.courses.find(
        (currentCourse) => currentCourse.id === action.payload
      );

      return {
        ...state,
        currentCombination: {
          ...state.currentCombination,
          courses: [...state.currentCombination.courses, courseToAdd],
        },
      };

    case ActionTypes.RemoveFromCombination:
      return {
        ...state,
        currentCombination: {
          ...state.currentCombination,
          courses: state.currentCombination.courses.filter(
            (currentCourse) => currentCourse.id !== action.payload
          ),
        },
      };

    case ActionTypes.SetCombinationName:
      return {
        ...state,
        currentCombination: {
          ...state.currentCombination,
          name: action.payload,
        },
      };

    case ActionTypes.SaveCombination:
      return {
        ...state,
        combinations: [action.payload, ...state.combinations],
        currentCombination: {
          name: "",
          courses: [],
        },
        successMessage: "Комбинация успешно сохранена!",
      };

    case ActionTypes.SetCombinations:
      return {
        ...state,
        combinations: action.payload,
      };

    case ActionTypes.DeleteCombination:
      return {
        ...state,
        combinations: state.combinations.filter(
          (currentCombination) => currentCombination.id !== action.payload
        ),
        successMessage: "Комбинация успешно удалена!",
      };

    case ActionTypes.SetLoading:
      return {
        ...state,
        loading: true,
      };

    case ActionTypes.SetError:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ActionTypes.ClearMessage:
      return {
        ...state,
        error: null,
        successMessage: "",
      };

    default:
      return state;
  }
}

export function CoursesProvider({ children }) {
  const [state, dispatch] = useReducer(coursesReducer, initialState);

  return (
    <CoursesContext.Provider value={{ state, dispatch }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCoursesContext() {
  const context = React.useContext(CoursesContext);

  if (!context) {
    throw new Error(
      "useCoursesContext необходимо использовать в CoursesProvider"
    );
  }

  return context;
}
