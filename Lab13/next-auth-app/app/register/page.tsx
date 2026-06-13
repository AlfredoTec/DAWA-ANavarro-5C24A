"use client";

import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/signIn?registered=true");
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
                Crear cuenta
              </Box>
              <Typography color="text.secondary" variant="body2">
                Regístrate para acceder a la aplicación
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
              <TextField
                autoComplete="name"
                fullWidth
                id="name"
                label="Nombre"
                name="name"
                onChange={handleChange}
                required
                type="text"
                value={form.name}
              />

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
                autoComplete="new-password"
                fullWidth
                helperText="Mínimo 6 caracteres"
                id="password"
                label="Contraseña"
                name="password"
                onChange={handleChange}
                required
                slotProps={{ htmlInput: { minLength: 6 } }}
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
                    <PersonAddAltRoundedIcon />
                  )
                }
                type="submit"
                variant="contained"
              >
                {loading ? "Registrando..." : "Crear cuenta"}
              </Button>
            </Stack>

            <Typography align="center" color="text.secondary" variant="body2">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/signIn"
                style={{ color: "#1d4ed8", fontWeight: 600, textDecoration: "none" }}
              >
                Iniciar sesión
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
