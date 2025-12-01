import React from "react";
import type { AuthContextType } from "./types";

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
