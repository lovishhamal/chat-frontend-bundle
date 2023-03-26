import { lazy, useContext, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LazyLoader } from "../common";
import { SET_LOGGED_IN_USER } from "../constants/actions";
import { LOCAL_STORAGE } from "../constants/common";
import { uiRoutes } from "../constants/uiRoutes";
import { AuthContext } from "../context";
import { LocalStorage } from "../util/localStorage";

const LoginPage = LazyLoader(lazy(() => import("../pages/auth/login")));
const RegisterPage = LazyLoader(lazy(() => import("../pages/auth/register")));
const ChatPage = LazyLoader(lazy(() => import("../pages/chat")));

export const AppRoutes = () => {
  const navigate = useNavigate();

  const { dispatch } = useContext<any>(AuthContext);

  useEffect(() => {
    setLoggedInUser();
  }, []);

  const setLoggedInUser = async () => {
    const user = LocalStorage.getLocalStorage(LOCAL_STORAGE.getUser);

    if (user) {
      dispatch({ type: SET_LOGGED_IN_USER, payload: user });
      navigate(uiRoutes.dashboard);
    }
  };

  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const location = useLocation();
    const isAuthenticated = !!LocalStorage.getLocalStorage("user");

    if (!isAuthenticated) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.

      return (
        <Navigate replace state={{ from: location }} to={uiRoutes.auth.login} />
      );
    }

    return children;
  };

  return (
    <Routes>
      <Route element={<LoginPage />} path={uiRoutes.auth.login} />
      <Route element={<RegisterPage />} path={uiRoutes.auth.register} />
      <Route
        element={
          <RequireAuth>
            <ChatPage />
          </RequireAuth>
        }
        path={uiRoutes.dashboard}
      />
    </Routes>
  );
};
