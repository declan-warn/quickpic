import { create, css, linkToCSS } from "/src/helpers.js";
import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

import TextField from "/src/components/TextField.js";

customElements.define("qp-signup", class extends HTMLElement {
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
        create("div", { class: "floating card popup auth__container" }, [
          create("form", { id: "signup", onSubmit: this.handleSubmit }, [
            create("span", { class: "h600" }, ["Sign Up"]),
            create("label", { for: "username", class: "h200" }, ["Username"]),
            create("input", { id: "username", name: "username", required: true }),
            create("label", { for: "password", class: "h200" }, ["Password"]),
            create("input", { id: "password", name: "password", type: "password", required: true }),
            create("label", { for: "email", class: "h200" }, ["Email"]),
            create("input", { id: "email", name: "email", type: "email" }),
            create("label", { for: "name", class: "h200" }, ["Name"]),
            create("input", { id: "name", name: "name" }),
            create("div", { class: "button-group", style: { marginTop: "16px" } }, [
              create("button", {}, ["Submit"]),
              create("a", { href: "#/auth/login", class: "button" }, ["Log In"]),
            ]),
          ]),
        ])
      ])
    )
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = this.shadowRoot.getElementById("signup");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const response = await api.auth.signup(payload);
    console.log(response);
  }
});
