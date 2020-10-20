import { create } from "/src/helpers.js";
import api from "/src/api.js";
import { navigateTo } from "/src/components/qp-router.js";

import baseStyle from "/src/styles/base.css.js";
import authStyle from "/src/styles/auth.css.js";

customElements.define("qp-signup", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [baseStyle, authStyle];

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { class: "auth__container" }, [
        create("form", { id: "signup", class: "floating card auth__form", onSubmit: this.handleSubmit }, [
          create("h1", { class: "auth__title h600" }, ["Sign Up"]),
          create("span", { class: "auth__description" }, ["Making an account lets you view posts and make your own"]),
          create("label", { for: "username", class: "h200", required: true }, ["Username"]),
          create("input", { id: "username", name: "username", required: true }),
          create("label", { for: "password", class: "h200", required: true }, ["Password"]),
          create("input", { id: "password", name: "password", type: "password", required: true }),
          create("label", { for: "confirm", class: "h200", required: true }, ["Confirm password"]),
          create("input", { id: "confirm", name: "confirm", type: "password", required: true }),
          create("label", { for: "email", class: "h200" }, ["Email"]),
          create("input", { id: "email", name: "email", type: "email" }),
          create("label", { for: "name", class: "h200" }, ["Name"]),
          create("input", { id: "name", name: "name" }),
          create("div", { class: "button-group", style: { marginTop: "16px" } }, [
            create("button", { appearance: "primary" }, ["Submit"]),
            create("button", { onClick: () => navigateTo("/auth/login"), appearance: "subtle" }, ["Log In"]),
          ]),
        ]),
      ])
    );

    this.shadowRoot
      .getElementById("confirm")
      .addEventListener("input", ({ currentTarget, target }) => {
        if (this.shadowRoot.getElementById("password").value === currentTarget.value) {
          currentTarget.setCustomValidity("");
        } else {
          currentTarget.setCustomValidity("Passwords must match");
        }
      });

    document.documentElement.setAttribute("auth", "");
  }

  disconnectedCallback() {
    document.documentElement.removeAttribute("auth");
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = this.shadowRoot.getElementById("signup");
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    if (payload.password !== payload.confirm) {
      return alert("Passwords do not match");
    }

    const response = await api.auth.signup(payload);

    switch (response.status) {
      case 200:
        navigateTo("/feed");
        break;

      case 409:
        this.shadowRoot
          .getElementById("username")
          .insertAdjacentElement(
            "afterend",
            create("span", { class: "help-text", appearance: "error" }, [
              create("ion-icon", { name: "alert-circle" }),
              "This username is taken, please try another"
            ])
          )
    }
  }
});
