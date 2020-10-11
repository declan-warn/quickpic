import { create, css } from "/src/helpers.js";

import TextField from "/src/components/TextField.js";

const style = {
  padding: "1em",
  width: "100%",
  maxWidth: "80ch",
};

export default (api, goto) => {
  const onSubmit = async (event) => {
    event.preventDefault();

    const form = document.getElementById("login");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const { token, message } = await api.auth.login(payload);
    console.log(token, message);
    if (token) {
      window.localStorage.setItem("token", token);
      goto("feed");
    } else {

    }
  };

  return (
    create("div", {}, [
      create("form", { id: "login", style, onSubmit }, [
        create("h2", {}, ["Log In"]),
        TextField("username", { label: "Username", required: true }),
        TextField("password", { label: "Password", required: true }),
        create("button", {}, ["Submit"])
      ]),
      create("a", { href: "#/signup" }, ["Sign Up"])
    ])
  );
}
