import { create } from "/src/helpers.js";

import { navigateTo } from "/src/components/qp-router.js";

import "/src/components/qp-dropdown.js";

customElements.define("qp-app", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (!sessionStorage.getItem("token")) {
      return navigateTo("/auth/login");
    }

    this.shadowRoot.append(
      create("qp-nav", {}, [
        create("qp-nav-link", { to: "feed" }, ["Feed"]),
        create("qp-nav-link", { to: "post/new" }, [
          create("button", {}, ["New Post"])
        ]),
        create("qp-dropdown", {}, [
          create("qp-avatar", { size: "medium", slot: "entry" }),
          create("a", { href: "#/user" }, ["Profile"]),
          create("a", { href: "#/auth/signout" }, ["Sign Out"]),
        ])
      ]),
      create("slot")
    );
  }
});
