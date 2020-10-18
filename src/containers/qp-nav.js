import { create, linkToCSS } from "/src/helpers.js";

import navStyle from "/src/styles/nav.js";

customElements.define("qp-nav", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    console.log(navStyle);
    this.shadowRoot.adoptedStyleSheets = [navStyle];
    this.shadowRoot.append(
      create("nav", {}, [
        create("div", {}, [
          create("slot", { name: "logo" }),
          create("slot", { name: "primary" }),
        ]),
        create("div", {}, [
          create("slot", { name: "secondary" }),
        ]),
      ])
    );
  }
});

customElements.define("qp-nav-link", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [navStyle];
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("button", { "aria-label": this.getAttribute("aria-label") }, [
        create("slot")
      ])
    );
  }
});
