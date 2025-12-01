"use client";

import * as React from "react";
import { useNavigate, useSearchParams } from "react-router";
import { logoutUser } from "@/api/login";
import { toast } from "sonner";
import { AuthContext } from ".";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    document.cookie.split("; ").some((row) => row.startsWith("session="))
  );

  const login = () => {
    setIsLoggedIn(true);

    const nextPath = searchParams.get("next");

    if (nextPath) {
      navigate(nextPath, { replace: true });
    } else {
      navigate("/");
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
      setIsLoggedIn(false);
      toast("Logout successfully.", {
        position: "top-center"
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed.", {
        position: "top-center"
      });
    }
  };

  const value = { isLoggedIn, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
