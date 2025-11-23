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

export default function CouseSelector() {

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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
          
      </Grid>
    </Box>
  );
}
