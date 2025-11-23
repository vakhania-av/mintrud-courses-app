import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

import useCoursesStore from "../hooks/useCoursesStore";

export default function CourseSelector() {
  const { 
    courses, 
    selectedCourses, 
    fetchCourses, 
    loading, 
    error, 
    toggleCourse,
    clearMessage
  } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    return () => {
      if (error) {
        clearMessage();
      }
    };
  }, [error, clearMessage]);

  const isSelected = (courseId) =>
    selectedCourses.some((currentCourse) => currentCourse.id === courseId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Загрузка курсов...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <SchoolIcon
          sx={{
            mr: 1,
            color: "primary.main",
            fontSize: 32,
          }}
        />
        <Typography variant="h5" fontWeight="bold">
          Выберите курсы обучения
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessage}>
          {error}
        </Alert>
      )}

      <Grid container spacing={1}>
        {courses.length > 0 && courses.map((course) => (
          <Grid key={course.id} size={{ xs: 12, sm: 6, md: 5 }}>
            <Card
              sx={{
                height: '100%',
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: isSelected(course.id)
                  ? "2px solid #4caf50"
                  : "1px solid #e0e0e0",
                backgroundColor: isSelected(course.id)
                  ? "#f1f8f4"
                  : "transparent",
                "&:hover": {
                  boxShadow: 3,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => toggleCourse(course.id)}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box display="flex" alignItems="flex-start" gap={0.5}>
                  <Checkbox
                    checked={isSelected(course.id)}
                    color="success"
                    onChange={() => toggleCourse(course.id)}
                    onClick={(evt) => evt.stopPropagation()}
                    disabled={selectedCourses.length >= 3 && !isSelected(course.id)}
                  />
                  <Box flex={1}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="primary"
                      sx={{ mb: 0.5 }}
                    >
                      {course.code}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {course.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
