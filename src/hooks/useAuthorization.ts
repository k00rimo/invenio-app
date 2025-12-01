"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from ".";


export const useAuthGuard = (): boolean => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run the effect if the user is NOT logged in
    if (!isLoggedIn) {
      // Give the toast an ID to prevent it from ever stacking
      toast.error("You need to log in first.", {
        position: "top-center",
        id: "auth-error-toast",
      });

      // Get the current path (including query params)
      const currentPath = location.pathname + location.search;

      // Use 'replace: true' so the user can't click "back" to this page
      navigate(`/login?next=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
    }
  }, [isLoggedIn, navigate, location]);

  // Return the status so the component can avoid rendering
  return isLoggedIn;
};


export const useAuthAction = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const withAuthCheck = (action: () => void) => {
    if (isLoggedIn) {
      // User is logged in, run the action.
      action();
    } else {
      // User is not logged in.
      toast.error("You need to log in first.", {
        position: "top-center",
        id: "auth-error-toast",
      });

      // Get the current path (including query params)
      const currentPath = location.pathname + location.search;

      // Navigate to login, passing the current path.
      navigate(`/login?next=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
    }
  };

  return { withAuthCheck };
};
