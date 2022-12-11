import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext, AuthReducer } from "./context";
import { AppRoutes } from "./routes";

const App = () => {
  const { state, dispatch } = AuthReducer();
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
