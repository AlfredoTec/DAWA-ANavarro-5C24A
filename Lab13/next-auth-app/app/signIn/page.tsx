"use client";

import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
        flex: 1,
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="h1"
                sx={{ fontSize: "2.125rem", fontWeight: 700, lineHeight: 1.2, mb: 1, mt: 0 }}
              >
                Iniciar sesión
              </Box>
              <Typography color="text.secondary" variant="body2">
                Accede a tu cuenta
              </Typography>
            </Box>

            {registered && (
              <Alert severity="success">
                Cuenta creada exitosamente. Inicia sesión.
              </Alert>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
              <TextField
                autoComplete="email"
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={form.email}
              />

              <TextField
                autoComplete="current-password"
                fullWidth
                id="password"
                label="Contraseña"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={form.password}
              />

              <Button
                disabled={loading}
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress color="inherit" size={18} />
                  ) : (
                    <LoginRoundedIcon />
                  )
                }
                type="submit"
                variant="contained"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </Stack>

            <Divider>
              <Typography color="text.secondary" variant="caption">
                O continúa con
              </Typography>
            </Divider>

            <Stack spacing={1.5}>
              <Button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                size="large"
                startIcon={<FcGoogle />}
                variant="outlined"
              >
                Continuar con Google
              </Button>
              <Button
                color="inherit"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                size="large"
                startIcon={<FaGithub />}
                variant="outlined"
              >
                Continuar con GitHub
              </Button>
            </Stack>

            <Typography align="center" color="text.secondary" variant="body2">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                style={{ color: "#1d4ed8", fontWeight: 600, textDecoration: "none" }}
              >
                Regístrate
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
