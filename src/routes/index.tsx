import { BrowserRouter, Route, Routes } from "react-router-dom";
import { uiRoutes } from "../constants/uiRoutes";
import { LoginPage, RegisterPage } from "../pages";

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<LoginPage />} path={uiRoutes.auth.login}></Route>
      <Route element={<RegisterPage />} path={uiRoutes.auth.register}></Route>
    </Routes>
  </BrowserRouter>
);
