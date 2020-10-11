import { create, linkToCSS } from "/src/helpers.js";

customElements.define("qp-avatar", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-avatar.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);
  }

  connectedCallback() {
    this.shadowRoot.append(
      create("div", { id: "container" }, [
        create("img", { src: this.getAttribute("src") })
      ])
    );
  }
});
