import "../../styles/signin.css";
import { useState } from "react";
import Logotipo from "../../components/Logotipo/Logotipo";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { setToken } from "../../utils/token";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorLogin, setErrorLogin] = useState(false);
  const navigate = useNavigate();

  const handleChangeForm = (e) => {
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleCadastrar = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email: form.email,
        senha: form.password,
      });
      setToken(response.data.token);
      localStorage.setItem("userId", response.data.usuario.id);
      navigate("/main");
    } catch (error) {
      if (error.response.data === "Email e senha não conferem.") {
        setErrorLogin(true);
      }
    }
  };
  return (
    <div className="container-login">
      <aside className="infos">
        <Logotipo />
        <h1>
          Controle suas<span className="cor-azul">finanças</span>,{" "}
        </h1>
        <h1>sem planilha chata</h1>
        <p>
          Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem
          tudo num único lugar e em um clique de distância.
        </p>
        <button onClick={handleCadastrar}>Cadastre-se</button>
      </aside>
      <div className="card-login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChangeForm}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChangeForm}
          />
          {errorLogin && (
            <span className="error">E-mail ou senha incorretos</span>
          )}
          <button>Entrar</button>
        </form>
      </div>
    </div>
  );
}
