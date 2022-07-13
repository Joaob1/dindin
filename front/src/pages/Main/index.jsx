import "../../styles/main.css";
import Logotipo from "../../components/Logotipo/Logotipo.jsx";
import profile from "../../assets/profile.svg";
import logout from "../../assets/logout.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import ModalUsuario from "../../components/ModalUsuario/ModalUsuario";
import { getToken, removeToken } from "../../utils/token";
import Registros from "../../components/Registros/Registros";
export default function Main() {
  const token = getToken();
  const [usuario, setUsuario] = useState({});
  const [modalUsuario, setModalUsuario] = useState(false);
  const navigate = useNavigate();
  const getUsuario = async () => {
    try {
      const response = await api.get("/usuario");
      setUsuario(response.data);
    } catch (error) {
      return;
    }
  };
  useEffect(() => {
    getUsuario();
  }, []);
  const atualizarUsuario = () => {
    setModalUsuario(true);
  };
  const Logout = () => {
    removeToken();
    localStorage.removeItem("userId");
    navigate("/");
  };
  return (
    <div className="container-main">
      <Logotipo />
      <nav>
        <img
          src={profile}
          alt="Perfil"
          className="profile-icon"
          onClick={atualizarUsuario}
        />
        <strong className="user-name" onClick={atualizarUsuario}>
          {usuario.nome}
        </strong>
        {modalUsuario && (
          <ModalUsuario
            setModalUsuario={setModalUsuario}
            getUsuario={getUsuario}
            token={token}
            nome={usuario.nome}
            email={usuario.email}
          />
        )}
        <img src={logout} alt="LogOut" className="logout" onClick={Logout} />
      </nav>
      <main>
        <Registros />
      </main>
    </div>
  );
}
