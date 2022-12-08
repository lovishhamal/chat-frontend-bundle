import { BrowserRouter, Route, Routes } from "react-router-dom";
import { uiRoutes } from "../constants/uiRoutes";
import { LoginPage, RegisterPage } from "../pages";
import ChatPage from "../pages/chat";

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<LoginPage />} path={uiRoutes.auth.login}></Route>
      <Route element={<RegisterPage />} path={uiRoutes.auth.register}></Route>
      <Route element={<ChatPage />} path={uiRoutes.dashboard}></Route>
    </Routes>
  </BrowserRouter>
);
