import { create, css, linkToCSS } from "/src/helpers.js";
import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

import TextField from "/src/components/TextField.js";

customElements.define("qp-login", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-auth.css");
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "auth__backdrop" }, [
        create("div", { class: "card floating popup auth__container" }, [
          create("form", { id: "login", onSubmit: this.handleSubmit }, [
            create("span", { class: "h600" }, ["Log In"]),
            create("label", { for: "username", class: "h200" }, ["Username"]),
            create("input", { id: "username", name: "username", required: true }),
            create("label", { for: "password", class: "h200" }, ["Password"]),
            create("input", { id: "password", name: "password", type: "password", required: true }),
            create("div", { class: "button-group", style: { marginTop: "16px" } }, [
              create("button", {}, ["Submit"]),
              create("a", { href: "#/auth/signup", class: "button" }, ["Sign Up"]),
            ])
          ]),
        ])
      ])
    )
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = this.shadowRoot.getElementById("login");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const { token, message } = await api.auth.login(payload);
    console.log(token, message);
    if (token) {
      sessionStorage.setItem("token", token);
      navigateTo("feed");
    } else {

    }
  }
});
