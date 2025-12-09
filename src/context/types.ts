export interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => Promise<void>;
}
