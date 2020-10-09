import { create, css } from "/src/helpers.js";

const style = {
  padding: "1em",
  width: "100%",
  maxWidth: "80ch",
};

const onSubmit = event => {
  event.preventDefault();

};

export default () =>
  create("form", { style, onSubmit }, [
    create("h2", { textContent: "Log In" }),
    create("label", { for: "username" }, [
      create("input", { id: "username" }),
    ]),
    create("label", { for: "password" }, [
      create("input", { id: "password" }),
    ]),
    create("button", { textContent: "Submit" })
  ]);
