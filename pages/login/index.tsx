import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import {
  rootSx,
  cardSx,
  cardContentSx,
  titleSx,
  subtitleSx,
  loginButtonSx,
} from '@/styles/login.styles';
import { useLogin } from '@/hooks/useLogin';

/**
 * Página de login. Better Auth + GitHub OAuth; el botón inicia el flujo con signIn.social.
 * Si ya hay sesión, redirige según rol: ADMIN → /, USER → /movimientos.
 */
export default function LoginPage() {
  const { error, handleSignInGitHub, showForm } = useLogin();

  if (!showForm) {
    return null;
  }

  return (
    <Box sx={rootSx}>
      <Card elevation={0} sx={cardSx}>
        <CardContent sx={cardContentSx}>
          <Typography component="h1" sx={titleSx}>
            Sistema de ingresos y gastos
          </Typography>
          <Typography sx={subtitleSx}>
            Inicia sesión con tu cuenta de GitHub para acceder al sistema.
          </Typography>
          {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            sx={loginButtonSx}
            onClick={handleSignInGitHub}
          >
            Iniciar sesión con GitHub
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
