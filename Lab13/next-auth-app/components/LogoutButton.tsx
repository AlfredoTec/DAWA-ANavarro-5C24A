"use client";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      color="error"
      onClick={() => signOut({ callbackUrl: "/" })}
      startIcon={<LogoutRoundedIcon />}
      variant="outlined"
    >
      Cerrar sesión
    </Button>
  );
}
