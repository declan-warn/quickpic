import { create, getAvatar } from "/src/helpers.js";
import api from "/src/api.js";

import avatarStyle from "/src/styles/components/avatar.css.js";

let cachedUsername;

customElements.define("qp-avatar", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [avatarStyle];
  }

  async connectedCallback() {
    if (!this.hasAttribute("user")) {
      if (cachedUsername) {
        this.setAttribute("user", cachedUsername);
      } else {
        const { username } = await api.user.getCurrent();
        cachedUsername = username;
        this.setAttribute("user", username);
      }
    }

    this.shadowRoot.append(
      create("div", { class: `avatar ${this.getAttribute("size") || "small"}` }, [
        create("img", { src: getAvatar(this.getAttribute("user")), alt: `${this.getAttribute("user")}'s avatar` })
      ])
    );
  }
});
