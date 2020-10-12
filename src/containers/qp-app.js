import { create } from "/src/helpers.js";

customElements.define("qp-app", class extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("qp-nav", {}, [
        create("qp-nav-link", { to: "feed" }, ["Feed"]),
        create("qp-nav-link", { to: "post/new" }, [
          create("button", {}, ["New Post"])
        ]),
        create("qp-nav-link", { to: "user" }, [
          create("qp-avatar", { size: "medium" })
        ])
      ]),
      create("slot")
    );
  }
});
