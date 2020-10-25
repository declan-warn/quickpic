import { create } from "/src/helpers.js";
import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

import baseStyle from "/src/styles/base.css.js";
import authStyle from "/src/styles/pages/auth.css.js";

import "/src/components/qp-banner.js";

/*
 * Login page
 *
 * Uses sessionStorage to save a token on successful login
*/

customElements.define("qp-login", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, authStyle];

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "auth__container" }, [
        create("form", { id: "login", class: "floating card auth__form", onSubmit: this.handleSubmit }, [
          create("h1", { class: "auth__title h600" }, ["Log In"]),
          create("span", { class: "auth__description" }, ["Sign in to catch up on what you've missed"]),
          create("label", { for: "username", class: "h200", required: true }, ["Username"]),
          create("input", { id: "username", name: "username", required: true }),
          create("label", { for: "password", class: "h200", required: true }, ["Password"]),
          create("input", { id: "password", name: "password", type: "password", required: true }),
          create("div", { class: "button-group", style: { marginTop: "16px" } }, [
            create("button", { appearance: "primary" }, ["Submit"]),
            create("button", { onClick: () => navigateTo("/auth/signup"), appearance: "subtle" }, ["Sign Up"]),
          ]),
        ])
      ])
    );

    document.documentElement.setAttribute("auth", "");
  }

  disconnectedCallback() {
    document.documentElement.removeAttribute("auth");
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = this.shadowRoot.getElementById("login");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const response = await api.auth.login(payload);

    switch (response.status) {
      case 200:
        sessionStorage.setItem("token", response.token);
        navigateTo("/feed");
        break;

      case 403:
        if (!this.shadowRoot.querySelector("qp-banner")) {
          this.shadowRoot.prepend(create("qp-banner", { appearance: "error" }, [response.message]));
        }
    }
  }
});
