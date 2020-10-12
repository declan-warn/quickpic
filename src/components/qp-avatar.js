import { create, linkToCSS, getAvatar } from "/src/helpers.js";
import api from "/src/api.js";

customElements.define("qp-avatar", class extends HTMLElement {
  static get stylesheet() {
    return linkToCSS("/styles/qp-avatar.css");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(this.constructor.stylesheet);
  }

  async connectedCallback() {
    if (!this.hasAttribute("user")) {
      const { username } = await api.user.getCurrent();
      this.setAttribute("user", username);
    }

    this.shadowRoot.append(
      create("div", { id: "container", class: this.getAttribute("size") || "small" }, [
        create("img", { src: getAvatar(this.getAttribute("user")) })
      ])
    );
  }
});
