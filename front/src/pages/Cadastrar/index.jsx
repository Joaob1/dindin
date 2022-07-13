import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logotipo from "../../components/Logotipo/Logotipo";
import "../../styles/signup.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Cadastrar() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorDifferentPassword, setErrorDifferentPassword] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [emailExistente, setEmailExistente] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [usuarioCadastrado, setUsuarioCadastrado] = useState(false);
  const navigate = useNavigate();
  const handleChangeForm = (e) => {
    const value = e.target.value;
    if (e.target.name === "name") {
      setErrorName(false);
    }
    if (e.target.name === "email") {
      setErrorEmail(false);
      setEmailExistente(false);
    }
    if (e.target.name === "password") {
      setErrorPassword(false);
    }
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setErrorDifferentPassword(false);
    }
    if (e.target.name === "confirmPassword") {
      setErrorConfirmPassword(false);
    }
    setForm({ ...form, [e.target.name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setErrorDifferentPassword(true);
    }
    if (form.name === "") {
      return setErrorName(true);
    }
    if (form.email === "") {
      return setErrorEmail(true);
    }
    if (form.password === "") {
      return setErrorPassword(true);
    }
    try {
      const response = await api.post("/usuario", {
        nome: form.name,
        email: form.email,
        senha: form.password,
      });
      setUsuarioCadastrado(true);
    } catch (error) {
      const mensagemErro = error.response.data.mensagem;
      if (mensagemErro === "Já existe usuário com o e-mail informado") {
        return setEmailExistente(true);
      }
    }
  };
  useEffect(() => {
    if (usuarioCadastrado) {
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, [usuarioCadastrado]);
  return (
    <div className="container-cadastro">
      <Logotipo />
      <div className="card-cadastro">
        {usuarioCadastrado ? (
          <h1>Usuário cadastrado!</h1>
        ) : (
          <>
            <h1>Cadastre-se</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChangeForm}
              />
              {errorName && (
                <span className="error">Insira o nome para cadastro</span>
              )}
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChangeForm}
              />
              {errorEmail && (
                <span className="error">Insira um e-mail para cadastro</span>
              )}
              {emailExistente && (
                <span className="error">
                  Já existe usuário com o e-mail informado
                </span>
              )}
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChangeForm}
              />
              {errorPassword && <span className="error">Insira uma senha</span>}
              <label htmlFor="confirmPassword">Confirmação de senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChangeForm}
              />
              {errorConfirmPassword && (
                <span className="error">Confirme a senha</span>
              )}
              {errorDifferentPassword && (
                <span className="error">Senhas não coincidem</span>
              )}
              <button type="submit">Cadastrar</button>
            </form>
            <Link to="/signin">Já tem cadastro? Clique aqui!</Link>
          </>
        )}
      </div>
    </div>
  );
}
