import { useEffect, useState } from "react";
import btnClose from "../../assets/fechar.svg";
import api from "../../services/api";

export default function ModalUsuario({
  setModalUsuario,
  token,
  nome,
  email,
  getUsuario,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [emailExistente, setEmailExistente] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorDifferentPassword, setErrorDifferentPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [userUpdated, setUserUpdated] = useState(false);
  useEffect(() => {
    setForm({ name: nome, email, password: "", confirmPassword: "" });
  }, []);
  const handleChangeForm = (e) => {
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
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };
  const fecharModal = () => {
    getUsuario();
    setModalUsuario(false);
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
      const response = await api.put("/usuario", {
        nome: form.name,
        email: form.email,
        senha: form.password,
      });
      setUserUpdated(true);
      setTimeout(() => {
        fecharModal();
      }, 1000);
    } catch (error) {
      if (
        error.response.data.mensagem ===
        "O e-mail informado já está sendo utilizado por outro usuário."
      ) {
        return setEmailExistente(true);
      }
    }
  };

  return (
    <div className="modal-background">
      <div className="modal">
        {userUpdated ? (
          <h1 className="updated">Usuário atualizado!</h1>
        ) : (
          <>
            <span>
              <h1>Editar Perfil</h1>
              <img
                src={btnClose}
                alt="Fechar"
                className="fechar"
                onClick={fecharModal}
              />
            </span>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChangeForm}
              />
              {errorName && (
                <span className="error">
                  Insira um nome de usuário para ser alterado
                </span>
              )}
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChangeForm}
              />
              {errorEmail && (
                <span className="error">Insira um email para ser alterado</span>
              )}
              {emailExistente && (
                <span className="error">O e-mail já está cadastrado</span>
              )}
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChangeForm}
              />
              {errorPassword && <span className="error">Insira sua senha</span>}
              <label htmlFor="confirmPassword">Confirmação de senha</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChangeForm}
              />
              {errorConfirmPassword && (
                <span className="error">Confirme a sua senha</span>
              )}
              {errorDifferentPassword && (
                <span className="error">Senhas não coincidem</span>
              )}
              <button className="confirmar">Confirmar</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
