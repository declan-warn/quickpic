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
      create("div", undefined, [
        create("form", { id: "signup", onSubmit: this.handleSubmit }, [
          create("h2", {}, ["Sign Up"]),
          TextField("username", { label: "Username", required: true }),
          TextField("password", { label: "Password", required: true }),
          TextField("email", { label: "E-mail" }),
          TextField("name", { label: "Name" }),
          create("button", {}, ["Submit"])
        ]),
        create("a", { href: "#/auth/login" }, ["Log In"])
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
