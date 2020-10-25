import { create, getAvatar } from "/src/helpers.js";
import api from "/src/api.js";

import avatarStyle from "/src/styles/components/avatar.css.js";

/*
 * Component that shows a user's avatar in a variety of sizes
 * 
 * Avatars are assigned using a seeded random number generator
 * to ensure distribution and reproducibility
 * 
 * This component will show and cache the current user's avatar if no user
 * parameter is given.
 * 
 * Modelled after <https://atlassian.design/components/avatar/examples>
*/

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
