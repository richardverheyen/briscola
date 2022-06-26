import { Auth, AuthProvider } from "./Auth";
import { User, UserProvider } from "./User";
import { BrowserRouter } from "react-router-dom";

function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { Auth, User, Providers };
