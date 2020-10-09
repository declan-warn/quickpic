import { create, css } from "/src/helpers.js";

const style = {
  padding: "1em",
  width: "100%",
  maxWidth: "80ch",
};

export default api => {
  const onSubmit = async (event) => {
    event.preventDefault();

    const form = document.getElementById("login");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const response = await api.login(payload);
    console.log(response);
  };

  return (
    create("div", undefined, [
      create("form", { id: "login", style, onSubmit }, [
        create("h2", { textContent: "Sign Up" }),
        create("label", { for: "username", textContent: "Username" }, [
          create("input", { id: "username", name: "username" }),
        ]),
        create("label", { for: "password", textContent: "Password" }, [
          create("input", { id: "password", name: "password" }),
        ]),
        create("button", { textContent: "Submit" })
      ]),
      create("a", { href: "#/login", textContent: "Log In" })
    ])
  );
}
