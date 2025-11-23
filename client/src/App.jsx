import { theme } from "./themes/theme";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

import { CoursesProvider } from "./context/CoursesContext";

import CourseSelector from "./components/CourseSelector";
import CombinationBuilder from "./components/CombinationBuilder";

function AppContent() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Планировщик обучения по охране труда (СМАРТА)
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Минтруд РФ
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          py: 4,
          backgroundColor: "#f9fafb",
        }}
      >
        <Container maxWidth="lg">
          <Box mb={4} textAlign="center">
            <Typography variant="h5" color="textSecondary" gutterBottom>
              Выбирайте и комбинируйте курсы обучения
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CourseSelector />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CombinationBuilder />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CoursesProvider>
        <AppContent />
      </CoursesProvider>
    </ThemeProvider>
  );
}
