import { create, linkToCSS } from "/src/helpers.js";

customElements.define("qp-nav", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-nav.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      this.constructor.stylesheet,
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
  static get stylesheet() {
    return linkToCSS("/styles/qp-nav.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("button", { "aria-label": this.getAttribute("aria-label") }, [
        create("slot")
      ])
    );
  }
});
