import { create, css } from "/src/helpers.js";
import TextField from "/src/components/TextField.js";

const style = {
  padding: "1em",
  width: "100%",
  maxWidth: "80ch",
};

export default api => {
  const onSubmit = async (event) => {
    event.preventDefault();

    const form = document.getElementById("signup");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const response = await api.auth.signup(payload);
    console.log(response);
  };

  return (
    create("div", undefined, [
      create("form", { id: "signup", style, onSubmit }, [
        create("h2", {}, ["Sign Up"]),
        TextField("username", { label: "Username", required: true }),
        TextField("password", { label: "Password", required: true }),
        TextField("email", { label: "E-mail" }),
        TextField("name", { label: "Name" }),
        create("button", {}, ["Submit"])
      ]),
      create("a", { href: "#/login" }, ["Log In"])
    ])
  );
}
