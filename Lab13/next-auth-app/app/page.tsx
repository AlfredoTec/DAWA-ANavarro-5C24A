"use client";

import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box sx={{ alignItems: "center", display: "flex", flex: 1, justifyContent: "center" }}>
        <CircularProgress aria-label="Cargando sesión" />
      </Box>
    );
  }

  return (
    <Box sx={{ alignItems: "center", bgcolor: "background.default", display: "flex", flex: 1, py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="h1"
                sx={{ fontSize: "2.125rem", fontWeight: 700, lineHeight: 1.2, mb: 1, mt: 0 }}
              >
                Bienvenido
              </Box>
              <Typography color="text.secondary">
                Inicia sesión para acceder a la aplicación
              </Typography>
            </Box>
            <Button
              fullWidth
              onClick={() => router.push("/signIn")}
              size="large"
              startIcon={<LoginRoundedIcon />}
              variant="contained"
            >
              Iniciar sesión
            </Button>
            <Button
              fullWidth
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              size="large"
              startIcon={<FcGoogle />}
              variant="outlined"
            >
              Continuar con Google
            </Button>
            <Button
              color="inherit"
              fullWidth
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              size="large"
              startIcon={<FaGithub />}
              variant="outlined"
            >
              Continuar con GitHub
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
