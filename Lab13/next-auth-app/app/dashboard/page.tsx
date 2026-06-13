"use client";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signIn");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <CircularProgress aria-label="Cargando sesión" />
      </Box>
    );
  }

  if (!session) return null;

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
          <Stack spacing={3} sx={{ alignItems: "center" }}>
            <Box
              component="h1"
              sx={{ fontSize: "2.125rem", fontWeight: 700, lineHeight: 1.2, m: 0 }}
            >
              Dashboard
            </Box>

            <Avatar
              alt={session.user?.name ?? "Usuario"}
              src={session.user?.image ?? undefined}
              sx={{ bgcolor: "primary.main", height: 88, width: 88 }}
            >
              {!session.user?.image && (
                <AccountCircleRoundedIcon fontSize="large" />
              )}
            </Avatar>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6">
                Hola, <strong>{session.user?.name}</strong>
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {session.user?.email}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Button
                fullWidth
                onClick={() => router.push("/profile")}
                startIcon={<AccountCircleRoundedIcon />}
                variant="contained"
              >
                Ver perfil
              </Button>
              <LogoutButton />
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
