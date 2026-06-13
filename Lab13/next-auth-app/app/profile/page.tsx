"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from "@mui/material";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
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
              Mi Perfil
            </Box>

            <Avatar
              alt={session.user?.name ?? "Foto de perfil"}
              src={session.user?.image ?? undefined}
              sx={{
                bgcolor: "primary.main",
                border: "4px solid",
                borderColor: "primary.light",
                height: 104,
                width: 104,
              }}
            >
              {!session.user?.image && <PersonRoundedIcon fontSize="large" />}
            </Avatar>

            <List
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <ListItem>
                <ListItemIcon>
                  <PersonRoundedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Nombre"
                  secondary={session.user?.name ?? "Sin nombre registrado"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailRoundedIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Correo electrónico"
                  secondary={session.user?.email ?? "Sin correo registrado"}
                />
              </ListItem>
            </List>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Button
                fullWidth
                onClick={() => router.push("/dashboard")}
                startIcon={<ArrowBackRoundedIcon />}
                variant="contained"
              >
                Ir al Dashboard
              </Button>
              <LogoutButton />
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
