import React, { useEffect } from "react";
import { DEFAULT_TIMEOUT } from "../const";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkIcon from "@mui/icons-material/Link";

import useCoursesStore from "../hooks/useCoursesStore";

export default function CombinationBuilder() {
  const {
    courses,
    currentCombination,
    combinations,
    saveCombination,
    fetchCombinations,
    deleteCombination,
    addToCombination,
    removeFromCombination,
    setCombinationName,
    error,
    successMessage,
    clearMessage,
  } = useCoursesStore();

  useEffect(() => {
    fetchCombinations();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearMessage, DEFAULT_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearMessage]);

  const handleAddCourse = (courseId) => {
    if (!courseId) {
        return;
    }

    if (currentCombination.courses.length >= 3) {
      return;
    }

    addToCombination(courseId);
  };

  const handleNameChange = (evt) => {
    setCombinationName(evt.target.value);
  };

  // Фильтруем курсы, которые еще не добавлены в текущую комбинацию
  const availableCourses = courses.filter((course) => 
    course && 
    course.id && 
    !currentCombination.courses.some(selected => selected && selected.id === course.id)
  );

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <LinkIcon
          sx={{
            mr: 1,
            color: "secondary.main",
            fontSize: 32,
          }}
        />
        <Typography variant="h5" fontWeight="bold">
          Создать комбинацию курсов
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessage}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessage}>
          {successMessage}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Название комбинации */}
        <TextField
          variant="outlined"
          fullWidth
          label="Название комбинации"
          placeholder="Например: Работы на высоте + безопасность"
          value={currentCombination.name}
          onChange={handleNameChange}
          size="small"
          slotProps={{
            htmlInput: {
              "aria-label": "Название комбинации",
            },
          }}
        />

        {/* Выбор курсов */}
        <FormControl fullWidth size="small">
          <InputLabel>Добавить курс</InputLabel>
          <Select
            label="Добавить курс"
            value=""
            onChange={(evt) => {
                const courseId = evt.target.value;

                if (courseId) {
                    handleAddCourse(courseId);
                }
            }}
            disabled={
              currentCombination.courses.length >= 3 ||
              availableCourses.length === 0
            }
          >
            <MenuItem>Выберите курс...</MenuItem>
            {availableCourses.length > 0 ? (
              availableCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>
                Все курсы добавлены или достигнут лимит
              </MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Выбранные курсы */}
        <Card>
          <CardContent>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Выбранные курсы ({currentCombination.courses.length} / 3)
            </Typography>

            {currentCombination.courses.length === 0 ? (
              <Typography
                variant="body2"
                color="textSecondary"
                fontStyle="italic"
              >
                Выберите курсы из списка выше
              </Typography>
            ) : (
              <List disablePadding>
                {currentCombination.courses.map((course, idx) => (
                  <ListItem
                    key={course.id}
                    dense
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        color="error"
                        onClick={() => removeFromCombination(course.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Chip
                        color="primary"
                        label={idx + 1}
                        size="small"
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={course.code}
                      secondary={course.title}
                      slotProps={{
                        primary: {
                          variant: "body2",
                          fontWeight: "bold",
                        },
                        secondary: {
                          variant: "caption",
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Кнопка сохранения */}
        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          startIcon={<SaveIcon />}
          onClick={saveCombination}
          disabled={
            currentCombination.courses.length === 0 || !currentCombination.name
          }
        >
          Сохранить комбинацию
        </Button>

        {/* Сохраненные комбинации */}
        {combinations.length > 0 && (
          <Card sx={{ backgroundColor: "grey.50" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleIcon sx={{ mr: 1, color: "success.main" }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Сохранённые комбинации ({combinations.length})
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                {combinations.map((combination) => (
                  <Card key={combination.id} variant="outlined">
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight="bold">
                            {combination.combination_name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mb={1}
                          >
                            {new Date(combination.created_at).toLocaleString("ru-RU")}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            flexWrap="wrap"
                            gap={0.5}
                          >
                            {combination.courses &&
                              combination.courses.map((course, idx) => (
                                <Chip
                                  key={idx}
                                  label={`${idx + 1}. ${course.code}`}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                          </Stack>
                        </Box>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => {
                            if (window.confirm("Удалить комбинацию?")) {
                              deleteCombination(combination.id);
                            }
                          }}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
