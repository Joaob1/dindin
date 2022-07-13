import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Cadastrar from "./pages/Cadastrar";
import Login from "./pages/Login";
import Main from "./pages/Main/index.jsx";
import { getToken } from "./utils/token.js";

export default function MainRoutes() {
  function ProtectedRoutes({ redirectTo, signin }) {
    const isAuthenticated = getToken();
    if (signin) {
      return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
    } else {
      return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
    }
  }
  function Redirect({ redirectTo }) {
    return <Navigate to={redirectTo} />;
  }
  return (
    <Routes>
      <Route element={<ProtectedRoutes signin redirectTo={"/main"} />}>
        <Route path="/signup" element={<Cadastrar />} />
        <Route path="/signin" element={<Login />} />
      </Route>
      <Route path='/' element={<Redirect redirectTo={"/signin"} />}/>
      <Route element={<ProtectedRoutes redirectTo={"/signin"} />}>
        <Route path="/main" element={<Main />} />
      </Route>
    </Routes>
  );
}
